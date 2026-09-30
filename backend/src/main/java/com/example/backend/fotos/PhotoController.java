package com.example.backend.fotos;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.fotos.PhotoRepository.Photo;

@RestController
@RequestMapping("/api/fotos")
@CrossOrigin(origins = "http://localhost:4200")
public class PhotoController {

    private final PhotoRepository repository;

    public PhotoController(PhotoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String type = file.getContentType();
        if (type == null || !type.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("message", "El archivo debe ser una imagen."));
        }
        Photo photo = repository.save(file.getOriginalFilename(), type, file.getBytes());
        return ResponseEntity.status(HttpStatus.CREATED).body(photo);
    }

    @GetMapping
    public List<Photo> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}/imagen")
    public ResponseEntity<byte[]> image(@PathVariable long id) {
        return repository.findById(id)
                .map(s -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(s.photo().contentType()))
                        .body(s.data()))
                .orElse(ResponseEntity.notFound().build());
    }
}
