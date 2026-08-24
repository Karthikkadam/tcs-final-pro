package com.parcel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.parcel.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private JsonStorageService storageService;

    @Autowired
    private BookingService bookingService;

    private static final String FILE_NAME = "payments.json";
    private static final TypeReference<List<Payment>> TYPE_REF = new TypeReference<>() {};
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Map<String, Object> processPayment(String bookingId, String cardNumber, String expiryDate,
                                                String cvv, String cardholderName, String cardType) {
        Map<String, Object> result = new HashMap<>();

        // Validate card number (16 digits)
        if (cardNumber == null || !cardNumber.replaceAll("\\s", "").matches("\\d{16}")) {
            result.put("success", false);
            result.put("message", "Card number must be exactly 16 digits");
            return result;
        }

        // Validate CVV (3 or 4 digits)
        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            result.put("success", false);
            result.put("message", "CVV must be 3 or 4 digits");
            return result;
        }

        // Validate expiry date (MM/YY format, not expired)
        if (expiryDate == null || !expiryDate.matches("\\d{2}/\\d{2}")) {
            result.put("success", false);
            result.put("message", "Expiry date must be in MM/YY format");
            return result;
        }

        try {
            String[] parts = expiryDate.split("/");
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt("20" + parts[1]);
            LocalDateTime now = LocalDateTime.now();
            if (year < now.getYear() || (year == now.getYear() && month < now.getMonthValue())) {
                result.put("success", false);
                result.put("message", "Card has expired");
                return result;
            }
            if (month < 1 || month > 12) {
                result.put("success", false);
                result.put("message", "Invalid expiry month");
                return result;
            }
        } catch (NumberFormatException e) {
            result.put("success", false);
            result.put("message", "Invalid expiry date format");
            return result;
        }

        if (cardholderName == null || cardholderName.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "Cardholder name is required");
            return result;
        }

        // Check booking exists
        var booking = bookingService.getBookingById(bookingId);
        if (booking == null) {
            result.put("success", false);
            result.put("message", "Booking not found");
            return result;
        }

        // Generate payment and transaction IDs
        List<Payment> payments = storageService.readList(FILE_NAME, TYPE_REF);
        String paymentId = String.format("PAY%05d", payments.size() + 1);
        String transactionId = String.format("TXN%05d", payments.size() + 1);

        Payment payment = new Payment();
        payment.setPaymentId(paymentId);
        payment.setTransactionId(transactionId);
        payment.setBookingId(bookingId);
        payment.setAmount(booking.getParcelServiceCost());
        payment.setCardType(cardType != null ? cardType : "Credit");
        payment.setCardLastFour(cardNumber.replaceAll("\\s", "").substring(12));
        payment.setTransactionDate(LocalDateTime.now().format(FORMATTER));
        payment.setStatus("Success");

        payments.add(payment);
        storageService.writeList(FILE_NAME, payments);

        // Update booking with payment info
        bookingService.updatePaymentInfo(bookingId, paymentId, transactionId);

        result.put("success", true);
        result.put("message", "Payment successful");
        result.put("paymentId", paymentId);
        result.put("transactionId", transactionId);
        result.put("transactionDate", payment.getTransactionDate());
        result.put("transactionType", payment.getCardType());
        result.put("bookingId", bookingId);
        result.put("transactionAmount", payment.getAmount());
        result.put("transactionStatus", "Success");
        return result;
    }

    public Payment getPaymentByBookingId(String bookingId) {
        List<Payment> payments = storageService.readList(FILE_NAME, TYPE_REF);
        return payments.stream()
                .filter(p -> p.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst()
                .orElse(null);
    }
}
