import { Component, computed, OnDestroy, signal } from '@angular/core';

type Mode = 'foco' | 'descanso';

const DURATIONS: Record<Mode, number> = { foco: 25 * 60, descanso: 5 * 60 };
const STORAGE_KEY = 'pomodoro.completadas';

@Component({
  selector: 'app-temporizador',
  templateUrl: './temporizador.component.html',
  styleUrl: './temporizador.component.css',
})
export class TemporizadorComponent implements OnDestroy {
  readonly mode = signal<Mode>('foco');
  readonly remaining = signal(DURATIONS.foco);
  readonly running = signal(false);
  readonly completed = signal(this.loadCompleted());

  readonly display = computed(() => {
    const m = Math.floor(this.remaining() / 60);
    const s = this.remaining() % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  });

  readonly progress = computed(() => 1 - this.remaining() / DURATIONS[this.mode()]);

  private timer?: ReturnType<typeof setInterval>;
  private endsAt = 0;

  toggle() {
    if (this.running()) {
      this.stop();
    } else {
      this.endsAt = Date.now() + this.remaining() * 1000;
      this.running.set(true);
      this.timer = setInterval(() => this.tick(), 250);
    }
  }

  reset() {
    this.stop();
    this.remaining.set(DURATIONS[this.mode()]);
  }

  setMode(mode: Mode) {
    this.stop();
    this.mode.set(mode);
    this.remaining.set(DURATIONS[mode]);
  }

  ngOnDestroy() {
    this.stop();
  }

  private tick() {
    const left = Math.max(0, Math.round((this.endsAt - Date.now()) / 1000));
    this.remaining.set(left);
    if (left === 0) {
      const finished = this.mode();
      if (finished === 'foco') {
        this.completed.update((n) => n + 1);
        this.saveCompleted();
      }
      this.setMode(finished === 'foco' ? 'descanso' : 'foco');
    }
  }

  private stop() {
    clearInterval(this.timer);
    this.running.set(false);
  }

  private loadCompleted(): number {
    try {
      return Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      return 0;
    }
  }

  private saveCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, String(this.completed()));
    } catch {
      // sin almacenamiento: el contador solo dura mientras la página esté abierta
    }
  }
}
