import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ActionPanel } from './components/action-panel/action-panel';
import { ProfileCard } from "./components/profile-card/profile-card";
import { GalleryCard } from './components/gallery-card/gallery-card';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, ActionPanel, ProfileCard, GalleryCard, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private authService = inject(AuthService);

  // Controllo se è un utente o un ospite
  isLogged = this.authService.isLoggedIn();
}
