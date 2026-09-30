import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APPS } from '../apps/apps.generated';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly apps = APPS;
}
