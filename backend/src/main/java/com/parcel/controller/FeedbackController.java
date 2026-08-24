package com.parcel.controller;

import com.parcel.model.Feedback;
import com.parcel.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addFeedback(@RequestBody Feedback feedback) {
        Map<String, Object> result = feedbackService.addFeedback(feedback);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getFeedbackByBooking(@PathVariable String bookingId) {
        Feedback feedback = feedbackService.getFeedbackByBookingId(bookingId);
        if (feedback == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedback);
    }
}
