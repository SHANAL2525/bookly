package com.bookly;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BooklyApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void fullAuthenticatedBookingFlowWorks() {
        String email = "owner+" + System.currentTimeMillis() + "@bookly.test";

        ResponseEntity<String> registerResponse = post(
                "/api/auth/register",
                Map.of(
                        "name", "Owner User",
                        "email", email,
                        "password", "Password123!",
                        "businessName", "Bookly Test Business",
                        "role", "BUSINESS_OWNER"
                ),
                String.class
        );

        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(registerResponse.getBody()).isNotNull();
        JsonNode registerJson = readJson(registerResponse.getBody());
        assertThat(registerJson.path("token").asText()).isNotBlank();

        ResponseEntity<String> loginResponse = post(
                "/api/auth/login",
                Map.of(
                        "email", email,
                        "password", "Password123!"
                ),
                String.class
        );

        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResponse.getBody()).isNotNull();
        JsonNode loginJson = readJson(loginResponse.getBody());

        HttpHeaders headers = bearerHeaders(loginJson.path("token").asText());

        ResponseEntity<String> serviceResponse = exchange(
                "/api/services",
                HttpMethod.POST,
                Map.of(
                        "name", "Haircut",
                        "description", "Basic haircut",
                        "price", 25.0,
                        "durationMinutes", 30
                ),
                headers,
                String.class
        );

        assertThat(serviceResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(serviceResponse.getBody()).isNotNull();
        JsonNode serviceJson = readJson(serviceResponse.getBody());

        ResponseEntity<String> staffResponse = exchange(
                "/api/staff",
                HttpMethod.POST,
                Map.of(
                        "name", "John Barber",
                        "role", "Barber",
                        "email", "john+" + System.currentTimeMillis() + "@bookly.test",
                        "phone", "0771234567",
                        "availability", "Mon-Fri 09:00-17:00"
                ),
                headers,
                String.class
        );

        assertThat(staffResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(staffResponse.getBody()).isNotNull();
        JsonNode staffJson = readJson(staffResponse.getBody());

        ResponseEntity<String> bookingResponse = exchange(
                "/api/bookings",
                HttpMethod.POST,
                Map.of(
                        "customerName", "Alice",
                        "customerEmail", "alice@example.com",
                        "bookingDate", LocalDate.now().plusDays(1).toString(),
                        "bookingTime", "10:00:00",
                        "serviceId", serviceJson.path("id").asLong(),
                        "staffId", staffJson.path("id").asLong(),
                        "status", "PENDING",
                        "notes", "First visit"
                ),
                headers,
                String.class
        );

        assertThat(bookingResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(bookingResponse.getBody()).isNotNull();
        JsonNode bookingJson = readJson(bookingResponse.getBody());
        assertThat(bookingJson.path("serviceId").asLong()).isEqualTo(serviceJson.path("id").asLong());
        assertThat(bookingJson.path("staffId").asLong()).isEqualTo(staffJson.path("id").asLong());
    }

    @Test
    void protectedEndpointsRequireAuthentication() {
        ResponseEntity<String> response = restTemplate.getForEntity(url("/api/services"), String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private <T> ResponseEntity<T> post(String path, Object body, Class<T> responseType) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity(url(path), new HttpEntity<>(body, headers), responseType);
    }

    private <T> ResponseEntity<T> exchange(String path, HttpMethod method, Object body, HttpHeaders headers, Class<T> responseType) {
        HttpEntity<Object> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.exchange(url(path), method, requestEntity, responseType);
    }

    private HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        return headers;
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    private JsonNode readJson(String body) {
        try {
            return objectMapper.readTree(body);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to parse JSON response.", exception);
        }
    }
}
