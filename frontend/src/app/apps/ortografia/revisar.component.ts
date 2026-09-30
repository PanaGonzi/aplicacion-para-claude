import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface SpellingError {
  word: string;
  line: number;
  column: number;
  suggestions: string[];
}

interface SavedDocument {
  id: number;
  filename: string;
  characters: number;
}

@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  styleUrl: './revisar.component.css',
})
export class RevisarComponent {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly fileName = signal('');
  readonly errors = signal<SpellingError[]>([]);
  readonly saved = signal<SavedDocument | null>(null);
  readonly message = signal('');

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.fileName.set(file.name);
    this.errors.set([]);
    this.saved.set(null);
    this.message.set('');
    this.loading.set(true);

    const body = new FormData();
    body.append('file', file);
    this.http.post<{ document: SavedDocument }>('http://localhost:8080/api/ortografia/documentos', body).subscribe({
      next: (res) => {
        this.saved.set(res.document);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.errors.set(err.error.errors);
        } else {
          this.message.set(err.error?.message ?? 'No se pudo conectar con el backend.');
        }
        this.loading.set(false);
      },
    });
    (event.target as HTMLInputElement).value = '';
  }
}
