import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Photo {
  id: number;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

const API = 'http://localhost:8080/api/fotos';

@Component({
  selector: 'app-subir',
  imports: [DatePipe],
  templateUrl: './subir.component.html',
  styleUrl: './subir.component.css',
})
export class SubirComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly api = API;
  readonly loading = signal(false);
  readonly photos = signal<Photo[]>([]);
  readonly message = signal('');

  ngOnInit() {
    this.http.get<Photo[]>(API).subscribe({
      next: (list) => this.photos.set(list),
      error: () => this.message.set('No se pudo conectar con el backend.'),
    });
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;

    this.message.set('');
    this.loading.set(true);
    let pending = files.length;
    const done = () => {
      if (--pending === 0) this.loading.set(false);
    };
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      this.http.post<Photo>(API, body).subscribe({
        next: (photo) => {
          this.photos.update((list) => [...list, photo]);
          done();
        },
        error: (err: HttpErrorResponse) => {
          this.message.set(err.error?.message ?? 'No se pudo subir la foto (¿backend encendido?).');
          done();
        },
      });
    }
  }
}
