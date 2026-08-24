package com.parcel.controller;

import com.parcel.model.Payment;
import com.parcel.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, String> body) {
        String bookingId = body.get("bookingId");
        String cardNumber = body.get("cardNumber");
        String expiryDate = body.get("expiryDate");
        String cvv = body.get("cvv");
        String cardholderName = body.get("cardholderName");
        String cardType = body.get("cardType");

        Map<String, Object> result = paymentService.processPayment(
                bookingId, cardNumber, expiryDate, cvv, cardholderName, cardType);

        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getPayment(@PathVariable String bookingId) {
        Payment payment = paymentService.getPaymentByBookingId(bookingId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }
}
