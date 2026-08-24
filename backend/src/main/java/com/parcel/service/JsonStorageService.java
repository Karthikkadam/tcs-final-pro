package com.parcel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.*;
import java.util.*;

/**
 * Generic JSON file storage service.
 * Reads and writes data to JSON files in the data directory.
 */
@Service
public class JsonStorageService {

    private final ObjectMapper objectMapper;
    private String dataDir;

    public JsonStorageService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    @PostConstruct
    public void init() {
        // Use a writable directory for data storage
        String userDir = System.getProperty("user.dir");
        dataDir = userDir + File.separator + "data";
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        // Copy initial data files from classpath if they don't exist
        String[] files = {"users.json", "bookings.json", "payments.json", "feedback.json"};
        for (String file : files) {
            File target = new File(dataDir, file);
            if (!target.exists()) {
                try (InputStream is = getClass().getClassLoader().getResourceAsStream("data/" + file)) {
                    if (is != null) {
                        Files.copy(is, target.toPath());
                    } else {
                        // Create empty array file
                        objectMapper.writeValue(target, new ArrayList<>());
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public <T> List<T> readList(String filename, TypeReference<List<T>> typeRef) {
        try {
            File file = new File(dataDir, filename);
            if (!file.exists() || file.length() == 0) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(file, typeRef);
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public <T> void writeList(String filename, List<T> data) {
        try {
            File file = new File(dataDir, filename);
            objectMapper.writeValue(file, data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
