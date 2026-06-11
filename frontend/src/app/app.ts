import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  protected notificationService = inject(NotificationService);
}
