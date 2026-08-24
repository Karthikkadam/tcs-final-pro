package com.parcel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "service", "ParcelSwift Backend API",
                "status", "UP & RUNNING 🚀",
                "message", "Welcome to Parcel Management System REST API",
                "endpoints", Map.of(
                        "auth", "/api/auth",
                        "bookings", "/api/bookings",
                        "payments", "/api/payments",
                        "feedback", "/api/feedback"
                )
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "HEALTHY"));
    }
}
