import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SketchService } from '../sketches/services/sketch.service';
import { Navbar } from '../dashboard/components/navbar/navbar';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [DatePipe, Navbar],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private sketchService = inject(SketchService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // Dati utente
  username = signal<string>('Caricamento...');
  email = signal<string>('caricamento@email.com');
  drawingsCount = signal<number>(0);
  guessedCount = signal<number>(0);
  drawingsGuessedCount = signal<number>(0);
  failedCount = signal<number>(0);

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
      error: (err) => {
        console.error('Errore caricamento profilo', err)
        if (err.status === 404 || err.status === 401) {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  recuperaMieiDisegni() {
    this.sketchService.getMySketches().subscribe({
      next: (res) => {
        const sketches = res.data?.sketches || res.data || [];
        this.storicoDisegni.set(sketches);
      },
      error: (err) => console.error('Errore nel recupero dello storico disegni:', err)
    });
  }

  deleteAccount() {
  const confirmMsg = "ATTENZIONE: Questa azione è irreversibile. Sei davvero sicuro di voler eliminare il tuo account?";
  
  if (window.confirm(confirmMsg)) {
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout(); 
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error("Errore eliminazione:", err);
        this.notificationService.show("Errore durante l'eliminaazione dell'account.", 'error');
      }
    });
  }
}
}