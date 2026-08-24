package com.parcel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.parcel.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private JsonStorageService storageService;

    private static final String FILE_NAME = "bookings.json";
    private static final TypeReference<List<Booking>> TYPE_REF = new TypeReference<>() {};
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Cost calculation constants
    private static final double BASE_RATE = 50.0;
    private static final double WEIGHT_RATE_PER_GRAM = 0.02;
    private static final double STANDARD_DELIVERY = 30.0;
    private static final double EXPRESS_DELIVERY = 80.0;
    private static final double SAMEDAY_DELIVERY = 150.0;
    private static final double BASIC_PACKING = 10.0;
    private static final double PREMIUM_PACKING = 30.0;
    private static final double ADMIN_FEE = 50.0;
    private static final double TAX_RATE = 0.05;

    public double calculateCost(double weightInGrams, String deliveryType, String packingPreference, boolean isOfficerBooking) {
        double weightCharge = WEIGHT_RATE_PER_GRAM * weightInGrams;

        double deliveryCharge = switch (deliveryType) {
            case "Express" -> EXPRESS_DELIVERY;
            case "Same-Day" -> SAMEDAY_DELIVERY;
            default -> STANDARD_DELIVERY;
        };

        double packingCharge = "Premium".equals(packingPreference) ? PREMIUM_PACKING : BASIC_PACKING;

        double subtotal = BASE_RATE + weightCharge + deliveryCharge + packingCharge;
        if (isOfficerBooking) {
            subtotal += ADMIN_FEE;
        }

        return Math.round(subtotal * (1 + TAX_RATE) * 100.0) / 100.0;
    }

    public Map<String, Object> createBooking(Booking booking, boolean isOfficerBooking) {
        Map<String, Object> result = new HashMap<>();
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);

        // Generate booking ID
        String bookingId = String.format("BKG%05d", bookings.size() + 1);
        booking.setBookingId(bookingId);
        booking.setBookingDate(LocalDateTime.now().format(FORMATTER));

        // Calculate cost
        double cost = calculateCost(
                booking.getParcelWeightInGram(),
                booking.getParcelDeliveryType(),
                booking.getParcelPackingPreference(),
                isOfficerBooking
        );
        booking.setParcelServiceCost(cost);

        // Set status based on who is booking
        if (isOfficerBooking) {
            booking.setStatus("Assigned");
            booking.setBookedBy("OFFICER");
        } else {
            booking.setStatus("New");
            booking.setBookedBy("CUSTOMER");
        }

        bookings.add(booking);
        storageService.writeList(FILE_NAME, bookings);

        result.put("success", true);
        result.put("message", "Booking created successfully");
        result.put("bookingId", bookingId);
        result.put("serviceCost", cost);
        result.put("booking", booking);
        return result;
    }

    public Booking getBookingById(String bookingId) {
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);
        return bookings.stream()
                .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst()
                .orElse(null);
    }

    public List<Booking> getBookingsByCustomerId(String customerId) {
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);
        return bookings.stream()
                .filter(b -> b.getCustomerId().equalsIgnoreCase(customerId))
                .sorted((a, b) -> b.getBookingDate().compareTo(a.getBookingDate()))
                .collect(Collectors.toList());
    }

    public List<Booking> getAllBookings() {
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);
        bookings.sort((a, b) -> b.getBookingDate().compareTo(a.getBookingDate()));
        return bookings;
    }

    public Map<String, Object> cancelBooking(String bookingId, String customerId, String role) {
        Map<String, Object> result = new HashMap<>();
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);

        Optional<Booking> bookingOpt = bookings.stream()
                .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst();

        if (bookingOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Booking cancel failed, incorrect Booking ID");
            return result;
        }

        Booking booking = bookingOpt.get();

        // Customer can only cancel their own bookings
        if ("CUSTOMER".equals(role) && !booking.getCustomerId().equalsIgnoreCase(customerId)) {
            result.put("success", false);
            result.put("message", "Booking cancel failed, incorrect Booking ID");
            return result;
        }

        // Admin cannot cancel Delivered or InTransit
        if ("OFFICER".equals(role) && ("Delivered".equals(booking.getStatus()) || "InTransit".equals(booking.getStatus()))) {
            result.put("success", false);
            result.put("message", "Cannot cancel bookings that are Delivered or In Transit");
            return result;
        }

        // Only Booked status can be cancelled (for customer)
        if ("CUSTOMER".equals(role) && !"Booked".equals(booking.getStatus())) {
            result.put("success", false);
            result.put("message", "Only bookings with status 'Booked' can be cancelled");
            return result;
        }

        // Soft cancel
        booking.setStatus("Cancelled");
        storageService.writeList(FILE_NAME, bookings);

        result.put("success", true);
        result.put("bookingId", booking.getBookingId());
        result.put("amount", booking.getParcelServiceCost());

        if ("OFFICER".equals(role)) {
            result.put("message", "Booking cancelled successfully and Booking Amount will be refunded to the customer account within 5 working days");
        } else {
            result.put("message", "Booking cancelled successfully");
        }
        return result;
    }

    public Map<String, Object> updateStatus(String bookingId, String newStatus) {
        Map<String, Object> result = new HashMap<>();
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);

        Optional<Booking> bookingOpt = bookings.stream()
                .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst();

        if (bookingOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Booking not found");
            return result;
        }

        List<String> validStatuses = List.of("New", "Scheduled", "PickedUp", "Assigned", "Booked", "InTransit", "Delivered", "Cancelled");
        if (!validStatuses.contains(newStatus)) {
            result.put("success", false);
            result.put("message", "Invalid status: " + newStatus);
            return result;
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(newStatus);
        storageService.writeList(FILE_NAME, bookings);

        result.put("success", true);
        result.put("message", "Delivery status updated to '" + newStatus + "' successfully");
        result.put("booking", booking);
        return result;
    }

    public Map<String, Object> updateSchedule(String bookingId, String pickupTime, String dropoffTime) {
        Map<String, Object> result = new HashMap<>();
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);

        Optional<Booking> bookingOpt = bookings.stream()
                .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst();

        if (bookingOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Booking not found");
            return result;
        }

        Booking booking = bookingOpt.get();
        booking.setParcelPickupTime(pickupTime);
        booking.setParcelDropoffTime(dropoffTime);
        storageService.writeList(FILE_NAME, bookings);

        result.put("success", true);
        result.put("message", "Pickup and Dropoff times updated successfully");
        result.put("booking", booking);
        return result;
    }

    public Map<String, Object> updatePaymentInfo(String bookingId, String paymentId, String transactionId) {
        Map<String, Object> result = new HashMap<>();
        List<Booking> bookings = storageService.readList(FILE_NAME, TYPE_REF);

        Optional<Booking> bookingOpt = bookings.stream()
                .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst();

        if (bookingOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Booking not found");
            return result;
        }

        Booking booking = bookingOpt.get();
        booking.setPaymentId(paymentId);
        booking.setTransactionId(transactionId);
        booking.setParcelPaymentTime(LocalDateTime.now().format(FORMATTER));

        // If customer books, change status to Booked after payment
        if ("CUSTOMER".equals(booking.getBookedBy())) {
            booking.setStatus("Booked");
        }

        storageService.writeList(FILE_NAME, bookings);

        result.put("success", true);
        result.put("message", "Payment information updated");
        result.put("booking", booking);
        return result;
    }
}
