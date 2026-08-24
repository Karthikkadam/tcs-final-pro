package com.parcel.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    private String customerId;
    private String name;
    private String email;
    private String countryCode;
    private String mobile;
    private String address;
    private String zipCode;
    private String password;
    private String role; // CUSTOMER or OFFICER
    private String preferences;

    public User() {}

    public User(String customerId, String name, String email, String countryCode, String mobile,
                String address, String zipCode, String password, String role, String preferences) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.countryCode = countryCode;
        this.mobile = mobile;
        this.address = address;
        this.zipCode = zipCode;
        this.password = password;
        this.role = role;
        this.preferences = preferences;
    }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
}
