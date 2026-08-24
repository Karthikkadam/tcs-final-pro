package com.parcel.controller;

import com.parcel.model.User;
import com.parcel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> result = userService.register(user);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String customerId = credentials.get("customerId");
        String password = credentials.get("password");

        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Customer ID is required"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Password is required"));
        }

        Map<String, Object> result = userService.login(customerId, password);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(401).body(result);
    }

    @GetMapping("/user/{customerId}")
    public ResponseEntity<?> getUser(@PathVariable String customerId) {
        User user = userService.getUserById(customerId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Don't return password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> customers = userService.getAllCustomers();
        customers.forEach(c -> c.setPassword(null));
        return ResponseEntity.ok(customers);
    }
}
