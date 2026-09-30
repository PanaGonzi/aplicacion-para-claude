package com.example.backend.ortografia;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipInputStream;

import org.springframework.web.util.HtmlUtils;

/** Saca el texto plano de un .txt, .md o .docx. */
final class TextExtractor {

    private TextExtractor() {
    }

    static String extract(String filename, byte[] content) throws IOException {
        String name = filename == null ? "" : filename.toLowerCase();
        if (name.endsWith(".docx")) {
            return fromDocx(content);
        }
        if (name.endsWith(".txt") || name.endsWith(".md")) {
            return new String(content, StandardCharsets.UTF_8);
        }
        throw new IllegalArgumentException("Formato no soportado. Sube un .txt, .md o .docx");
    }

    private static String fromDocx(byte[] content) throws IOException {
        try (ZipInputStream zip = new ZipInputStream(new ByteArrayInputStream(content))) {
            for (ZipEntry e = zip.getNextEntry(); e != null; e = zip.getNextEntry()) {
                if (e.getName().equals("word/document.xml")) {
                    return xmlToText(new String(zip.readAllBytes(), StandardCharsets.UTF_8));
                }
            }
        } catch (ZipException e) {
            throw new IllegalArgumentException("El .docx no es válido");
        }
        throw new IllegalArgumentException("El .docx no es válido");
    }

    private static String xmlToText(String xml) {
        String s = xml
                .replace("</w:p>", "\n")
                .replace("<w:tab/>", "\t")
                .replace("<w:br/>", "\n")
                .replaceAll("<[^>]+>", "");
        return HtmlUtils.htmlUnescape(s);
    }
}
