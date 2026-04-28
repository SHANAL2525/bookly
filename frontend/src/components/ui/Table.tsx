type TableProps = {
  headers: string[];
  rows: React.ReactNode[][];
};

export default function Table({ headers, rows }: TableProps) {
  return (
    <div className="animate-fade-in-up overflow-x-auto rounded-[24px] bg-white shadow-[0_10px_24px_rgba(45,35,110,0.08)]">
      <table className="min-w-[640px] text-left text-sm md:min-w-full">
        <thead className="bg-[#f3f0ff] text-[#5b5b76]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#f0eeff] transition-colors duration-200 hover:bg-[#f5f2ff]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-[#374151]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
