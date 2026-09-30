package com.example.backend.ortografia;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.languagetool.JLanguageTool;
import org.languagetool.language.Spanish;
import org.languagetool.rules.Rule;
import org.languagetool.rules.RuleMatch;
import org.springframework.stereotype.Service;

/** Corrector ortográfico en español, offline (LanguageTool, solo reglas de ortografía). */
@Service
public class SpellCheckService {

    private static final int MAX_SUGGESTIONS = 3;

    private final JLanguageTool tool = new JLanguageTool(new Spanish());

    public SpellCheckService() {
        for (Rule rule : tool.getAllActiveRules()) {
            if (!rule.isDictionaryBasedSpellingRule()) {
                tool.disableRule(rule.getId());
            }
        }
    }

    public synchronized List<SpellingError> check(String text) {
        try {
            List<SpellingError> errors = new ArrayList<>();
            for (RuleMatch m : tool.check(text)) {
                String word = text.substring(m.getFromPos(), m.getToPos());
                int line = 1;
                int lineStart = 0;
                for (int i = 0; i < m.getFromPos(); i++) {
                    if (text.charAt(i) == '\n') {
                        line++;
                        lineStart = i + 1;
                    }
                }
                List<String> suggestions = m.getSuggestedReplacements().stream().limit(MAX_SUGGESTIONS).toList();
                errors.add(new SpellingError(word, line, m.getFromPos() - lineStart + 1, suggestions));
            }
            return errors;
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo revisar el texto", e);
        }
    }
}
