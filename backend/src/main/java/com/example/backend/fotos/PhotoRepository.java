package com.example.backend.fotos;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

/** BBDD ficticia: guarda en memoria y se pierde al reiniciar. */
@Repository
public class PhotoRepository {

    public record Photo(long id, String filename, String contentType, long size, Instant uploadedAt) {
    }

    public record Stored(Photo photo, byte[] data) {
    }

    private final List<Stored> photos = new ArrayList<>();
    private final AtomicLong ids = new AtomicLong();

    public synchronized Photo save(String filename, String contentType, byte[] data) {
        Photo photo = new Photo(ids.incrementAndGet(), filename, contentType, data.length, Instant.now());
        photos.add(new Stored(photo, data));
        return photo;
    }

    public synchronized List<Photo> findAll() {
        return photos.stream().map(Stored::photo).toList();
    }

    public synchronized Optional<Stored> findById(long id) {
        return photos.stream().filter(s -> s.photo().id() == id).findFirst();
    }
}
