import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Creo i signal per i dati dell'utente
  username = signal<string>('Caricamento...');
  drawingsCount = signal<number>(0);
  guessedCount = signal<number>(0);
  drawingsGuessedCount = signal<number>(0);
  failedCount = signal<number>(0);

  ngOnInit() {
    this.recuperaDatiUtente();
  }

  recuperaDatiUtente() {
    // Chiamata al server
    this.authService.getProfile().subscribe({
      next: (rispostaDelServer) => {
        const utente = rispostaDelServer.data.stats;

        // Aggiorniamo i signal con i dati estratti dal database
        this.username.set(utente.username || 'Utente anonimo');
        this.drawingsCount.set(utente.drawingsCount || 0);
        this.guessedCount.set(utente.guessedCount || 0);
        this.drawingsGuessedCount.set(utente.drawingsGuessedCount || 0);
        this.failedCount.set(utente.failedCount || 0);
      },
      error: (errore) => {
        console.error('Errore nel recupero dei dati del profilo:', errore);
        this.username.set('Errore di caricamento');

        // Protezione contro l'utente fantasma
        if (errore.status === 404 || errore.status === 401) {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  goToProfilePage() {
    this.router.navigate(['/profile']);
  }
}
