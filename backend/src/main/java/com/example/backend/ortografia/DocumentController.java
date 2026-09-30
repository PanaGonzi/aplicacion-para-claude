package com.example.backend.ortografia;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.ortografia.FakeDocumentRepository.SavedDocument;

@RestController
@RequestMapping("/api/ortografia")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentController {

    private final SpellCheckService spellCheck;
    private final FakeDocumentRepository repository;

    public DocumentController(SpellCheckService spellCheck, FakeDocumentRepository repository) {
        this.spellCheck = spellCheck;
        this.repository = repository;
    }

    /** Revisa el documento; solo lo guarda si no tiene faltas. Con faltas responde 422 y la lista. */
    @PostMapping("/documentos")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String text;
        try {
            text = TextExtractor.extract(file.getOriginalFilename(), file.getBytes());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
        List<SpellingError> errors = spellCheck.check(text);
        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("saved", false, "errors", errors));
        }
        SavedDocument doc = repository.save(file.getOriginalFilename(), text);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("saved", true, "document", doc));
    }

    @GetMapping("/documentos")
    public List<SavedDocument> list() {
        return repository.findAll();
    }
}
