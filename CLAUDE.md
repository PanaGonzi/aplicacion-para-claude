# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Cajón desastre": a shell Angular app that hosts many small mini-apps, plus a Spring Boot backend. The repo language (UI text, comments, docs) is Spanish.

- `backend/`: Java 17, Spring Boot (webmvc), Maven wrapper. Port 8080.
- `frontend/`: Angular 19 (standalone components, Karma/Jasmine). Port 4200.

## Commands

Backend (from `backend/`):
- Run: `./mvnw spring-boot:run`
- Tests: `./mvnw test`; single test: `./mvnw test -Dtest=BackendApplicationTests`

Frontend (from `frontend/`):
- Dev server: `npm start` (runs `scripts/dev.mjs`: the app-registry watcher + `ng serve`). Don't use bare `ng serve` unless you run `npm run apps` first.
- Build: `npm run build` (the `prebuild` hook regenerates the registry)
- Tests: `npm test`; single spec: `npm test -- --include=src/app/path/to.spec.ts`
- Regenerate registry only: `npm run apps`

## Architecture

### Auto-registered mini-apps (frontend)
Each mini-app is a folder `frontend/src/app/apps/<slug>/` containing an `app.meta.ts` that exports `appMeta: AppMeta` (name, description, pages with lazy `loadComponent`). `scripts/generate-apps.mjs` scans for those folders and writes `apps/apps.generated.ts` (**generated, never edit by hand**). `app.routes.ts` builds routes from `APPS` (`/<slug>/<page.path>`, with `/<slug>` redirecting to the first page), and the Home and sidebar list them from the same array. To add an app, just create the folder + `app.meta.ts` (see `frontend/src/app/apps/README.md`).

### Backend
Feature packages live under `com.example.backend.<feature>` and expose `/api/<feature>/...`; `StatusController` serves `/api/status`. Controllers use `@CrossOrigin(origins = "http://localhost:4200")` and the frontend calls the backend with hardcoded `http://localhost:8080` URLs (no proxy configured).

The `ortografia` feature: `POST /api/ortografia/documentos` extracts text (`TextExtractor`), spell-checks it with LanguageTool Spanish (`SpellCheckService`), and only saves when there are no errors (otherwise 422 with the error list). `FakeDocumentRepository` is an in-memory stand-in for a real DB (data lost on restart).

Not every mini-app needs the backend (e.g. `pomodoro` is frontend-only).
