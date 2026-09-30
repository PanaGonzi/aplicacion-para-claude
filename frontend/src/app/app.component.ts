import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private http = inject(HttpClient);

  message = signal('Conectando con el backend...');
  error = signal(false);

  constructor() {
    this.http.get<{ message: string }>('http://localhost:8080/api/status').subscribe({
      next: (res) => this.message.set(res.message),
      error: () => {
        this.error.set(true);
        this.message.set('No se pudo conectar con el backend');
      }
    });
  }
}
