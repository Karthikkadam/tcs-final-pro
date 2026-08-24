package com.parcel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.parcel.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private JsonStorageService storageService;

    private static final String FILE_NAME = "users.json";
    private static final TypeReference<List<User>> TYPE_REF = new TypeReference<>() {};

    /**
     * Initializes the default officer account if no officers exist.
     */
    @jakarta.annotation.PostConstruct
    public void initDefaultOfficer() {
        List<User> users = storageService.readList(FILE_NAME, TYPE_REF);
        boolean officerExists = users.stream().anyMatch(u -> "OFFICER".equals(u.getRole()));
        if (!officerExists) {
            User officer = new User();
            officer.setCustomerId("OFC00001");
            officer.setName("Admin Officer");
            officer.setEmail("admin@parcel.com");
            officer.setCountryCode("+91");
            officer.setMobile("9999999999");
            officer.setAddress("Parcel Management HQ, Mumbai");
            officer.setZipCode("400001");
            officer.setPassword(hashPassword("Admin@123"));
            officer.setRole("OFFICER");
            officer.setPreferences("Default admin account");
            users.add(officer);
            storageService.writeList(FILE_NAME, users);
        }
    }

    public Map<String, Object> register(User user) {
        Map<String, Object> result = new HashMap<>();
        List<User> users = storageService.readList(FILE_NAME, TYPE_REF);

        // Validate
        if (user.getName() == null || user.getName().trim().isEmpty() || user.getName().length() > 50) {
            result.put("success", false);
            result.put("message", "Customer Name is required (max 50 characters)");
            return result;
        }
        if (user.getEmail() == null || !user.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            result.put("success", false);
            result.put("message", "Valid email is required");
            return result;
        }
        if (user.getMobile() == null || !user.getMobile().matches("\\d{10}")) {
            result.put("success", false);
            result.put("message", "Mobile number must be 10 digits");
            return result;
        }
        if (user.getPassword() == null || user.getPassword().length() > 30 ||
                !user.getPassword().matches(".*[A-Z].*") ||
                !user.getPassword().matches(".*[a-z].*") ||
                !user.getPassword().matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            result.put("success", false);
            result.put("message", "Password must have max 30 chars with at least one uppercase, lowercase, and special character");
            return result;
        }

        // Check duplicate email
        boolean emailExists = users.stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(user.getEmail()));
        if (emailExists) {
            result.put("success", false);
            result.put("message", "Email already registered");
            return result;
        }

        // Generate customer ID
        long customerCount = users.stream().filter(u -> "CUSTOMER".equals(u.getRole())).count();
        String customerId = String.format("CUS%05d", customerCount + 1);
        user.setCustomerId(customerId);
        user.setRole("CUSTOMER");
        user.setPassword(hashPassword(user.getPassword()));

        users.add(user);
        storageService.writeList(FILE_NAME, users);

        result.put("success", true);
        result.put("message", "Customer Registration successful.");
        result.put("customerId", customerId);
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        return result;
    }

    public Map<String, Object> login(String customerId, String password) {
        Map<String, Object> result = new HashMap<>();
        List<User> users = storageService.readList(FILE_NAME, TYPE_REF);

        Optional<User> userOpt = users.stream()
                .filter(u -> u.getCustomerId().equalsIgnoreCase(customerId))
                .findFirst();

        if (userOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Invalid Customer ID. No account found.");
            return result;
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(hashPassword(password))) {
            result.put("success", false);
            result.put("message", "Invalid password. Please try again.");
            return result;
        }

        result.put("success", true);
        result.put("message", "Login successful");
        result.put("customerId", user.getCustomerId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        result.put("address", user.getAddress());
        result.put("mobile", user.getMobile());
        result.put("countryCode", user.getCountryCode());
        return result;
    }

    public User getUserById(String customerId) {
        List<User> users = storageService.readList(FILE_NAME, TYPE_REF);
        return users.stream()
                .filter(u -> u.getCustomerId().equalsIgnoreCase(customerId))
                .findFirst()
                .orElse(null);
    }

    public List<User> getAllCustomers() {
        List<User> users = storageService.readList(FILE_NAME, TYPE_REF);
        return users.stream().filter(u -> "CUSTOMER".equals(u.getRole())).toList();
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
