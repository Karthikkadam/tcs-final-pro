package com.parcel.controller;

import com.parcel.model.Booking;
import com.parcel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/customer")
    public ResponseEntity<Map<String, Object>> createCustomerBooking(@RequestBody Booking booking) {
        Map<String, Object> result = bookingService.createBooking(booking, false);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/officer")
    public ResponseEntity<Map<String, Object>> createOfficerBooking(@RequestBody Booking booking) {
        Map<String, Object> result = bookingService.createBooking(booking, true);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable String bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable String customerId) {
        List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {
        String customerId = body.get("customerId");
        String role = body.get("role");
        Map<String, Object> result = bookingService.cancelBooking(bookingId, customerId, role);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        Map<String, Object> result = bookingService.updateStatus(bookingId, newStatus);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PutMapping("/{bookingId}/schedule")
    public ResponseEntity<Map<String, Object>> updateSchedule(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {
        String pickupTime = body.get("pickupTime");
        String dropoffTime = body.get("dropoffTime");
        Map<String, Object> result = bookingService.updateSchedule(bookingId, pickupTime, dropoffTime);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<Map<String, Object>> calculateCost(@RequestBody Map<String, Object> body) {
        double weight = Double.parseDouble(body.get("weight").toString());
        String deliveryType = body.get("deliveryType").toString();
        String packingPreference = body.get("packingPreference").toString();
        boolean isOfficer = Boolean.parseBoolean(body.getOrDefault("isOfficer", "false").toString());

        double cost = bookingService.calculateCost(weight, deliveryType, packingPreference, isOfficer);
        return ResponseEntity.ok(Map.of("cost", cost));
    }
}
