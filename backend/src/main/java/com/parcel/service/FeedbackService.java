package com.parcel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.parcel.model.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FeedbackService {

    @Autowired
    private JsonStorageService storageService;

    private static final String FILE_NAME = "feedback.json";
    private static final TypeReference<List<Feedback>> TYPE_REF = new TypeReference<>() {};
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Map<String, Object> addFeedback(Feedback feedback) {
        Map<String, Object> result = new HashMap<>();

        if (feedback.getDescription() == null || feedback.getDescription().trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "Feedback description is required");
            return result;
        }

        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            result.put("success", false);
            result.put("message", "Rating must be between 1 and 5");
            return result;
        }

        List<Feedback> feedbackList = storageService.readList(FILE_NAME, TYPE_REF);

        // Check if feedback already exists for this booking
        boolean exists = feedbackList.stream()
                .anyMatch(f -> f.getBookingId().equalsIgnoreCase(feedback.getBookingId()));
        if (exists) {
            result.put("success", false);
            result.put("message", "Feedback already submitted for this booking");
            return result;
        }

        String feedbackId = String.format("FDB%05d", feedbackList.size() + 1);
        feedback.setFeedbackId(feedbackId);
        feedback.setDateTime(LocalDateTime.now().format(FORMATTER));

        feedbackList.add(feedback);
        storageService.writeList(FILE_NAME, feedbackList);

        result.put("success", true);
        result.put("message", "Feedback submitted successfully");
        result.put("feedbackId", feedbackId);
        return result;
    }

    public List<Feedback> getAllFeedback() {
        return storageService.readList(FILE_NAME, TYPE_REF);
    }

    public Feedback getFeedbackByBookingId(String bookingId) {
        List<Feedback> feedbackList = storageService.readList(FILE_NAME, TYPE_REF);
        return feedbackList.stream()
                .filter(f -> f.getBookingId().equalsIgnoreCase(bookingId))
                .findFirst()
                .orElse(null);
    }
}
