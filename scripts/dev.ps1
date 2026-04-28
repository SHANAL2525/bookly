$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$logStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backendLog = Join-Path $root ("backend\run-" + $logStamp + ".log")
$backendErrLog = Join-Path $root ("backend\run-" + $logStamp + ".err.log")

function Stop-PortProcess {
    param(
        [int]$Port
    )

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $connections |
            Select-Object -ExpandProperty OwningProcess -Unique |
            ForEach-Object {
                Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
            }
    }
}

function Wait-ForBackend {
    param(
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 3
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch {
        }

        Start-Sleep -Seconds 1
    }

    return $false
}

Stop-PortProcess -Port 3000
Stop-PortProcess -Port 8080

$backendProcess = Start-Process `
    -FilePath "mvn" `
    -ArgumentList "spring-boot:run" `
    -WorkingDirectory (Join-Path $root "backend") `
    -RedirectStandardOutput $backendLog `
    -RedirectStandardError $backendErrLog `
    -PassThru

try {
    Write-Host "Starting backend on http://localhost:8080 ..."

    if (-not (Wait-ForBackend)) {
        Write-Host "Backend failed to become ready. Recent backend logs:" -ForegroundColor Red
        if (Test-Path $backendLog) {
            Get-Content $backendLog -Tail 40
        }
        if (Test-Path $backendErrLog) {
            Get-Content $backendErrLog -Tail 40
        }
        throw "Backend startup failed."
    }

    Write-Host "Backend is ready. Starting frontend on http://localhost:3000 ..."
    & npm.cmd --prefix frontend run dev
    $frontendExitCode = $LASTEXITCODE
} finally {
    if ($backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
}

exit $frontendExitCode
