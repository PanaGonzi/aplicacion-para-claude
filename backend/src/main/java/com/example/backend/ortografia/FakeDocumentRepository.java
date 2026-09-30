package com.example.backend.ortografia;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

/** BBDD ficticia: guarda en memoria y se pierde al reiniciar. Sustituir por una real más adelante. */
@Repository
public class FakeDocumentRepository {

    public record SavedDocument(long id, String filename, int characters, Instant savedAt) {
    }

    private final List<SavedDocument> documents = new ArrayList<>();
    private final AtomicLong ids = new AtomicLong();

    public synchronized SavedDocument save(String filename, String text) {
        SavedDocument doc = new SavedDocument(ids.incrementAndGet(), filename, text.length(), Instant.now());
        documents.add(doc);
        return doc;
    }

    public synchronized List<SavedDocument> findAll() {
        return List.copyOf(documents);
    }
}
