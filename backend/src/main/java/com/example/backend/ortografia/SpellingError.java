package com.example.backend.ortografia;

import java.util.List;

public record SpellingError(String word, int line, int column, List<String> suggestions) {
}
