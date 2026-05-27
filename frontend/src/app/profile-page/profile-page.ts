import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { SketchService } from '../sketches/services/sketch.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private sketchService = inject(SketchService);

  // Dati utente
  username = signal<string>('Caricamento...');
  email = signal<string>('caricamento@email.com');
  drawingsCount = signal<number>(0);
  guessedCount = signal<number>(0);
  drawingsGuessedCount = signal<number>(0);
  failedCount = signal<number>(0);

  // Qui verrà salvato lo storico dei disegni
  storicoDisegni = signal<any[]>([]); 

  ngOnInit() {
    this.recuperaDettagliProfilo();
    this.recuperaMieiDisegni();
  }

  recuperaDettagliProfilo() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        const utente = res.data.stats;
        this.username.set(utente.username || 'Utente');
        this.email.set(utente.email || 'Nessuna mail');
        this.drawingsCount.set(utente.drawingsCount || 0);
        this.guessedCount.set(utente.guessedCount || 0);
        this.drawingsGuessedCount.set(utente.drawingsGuessedCount || 0);
        this.failedCount.set(utente.failedCount || 0);
      },
      error: (err) => console.error('Errore caricamento profilo', err)
    });
  }

  recuperaMieiDisegni() {
    this.sketchService.getMySketches().subscribe({
      next: (res) => {
        // Estraggo i disegni dalla risposta del backend
        const sketches = res.data?.sketches || res.data || [];
        this.storicoDisegni.set(sketches);
      },
      error: (err) => console.error('Errore nel recupero dello storico disegni:', err)
    });
  }
}