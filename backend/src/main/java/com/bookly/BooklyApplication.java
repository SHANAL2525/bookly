package com.bookly;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.MapPropertySource;

@SpringBootApplication
public class BooklyApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BooklyApplication.class);
        application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event ->
                event.getEnvironment().getPropertySources().addFirst(
                        new MapPropertySource(
                                "booklyLocalOverrides",
                                Map.of(
                                        "debug", "false",
                                        "trace", "false"
                                )
                        )
                )
        );
        application.run(args);
    }
}
