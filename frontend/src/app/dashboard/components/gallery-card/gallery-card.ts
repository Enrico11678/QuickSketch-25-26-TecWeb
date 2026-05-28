import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SketchService } from '../../../sketches/services/sketch.service';

@Component({
  selector: 'app-gallery-card',
  standalone: true,
  imports: [DatePipe, RouterLink], // DatePipe per formattare la data del disegno
  templateUrl: './gallery-card.html',
  styleUrl: './gallery-card.scss',
})
export class GalleryCard implements OnInit {
  private sketchService = inject(SketchService);

  sketchesList = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  isLogged = signal<boolean>(false);

  ngOnInit() {
    // Controllo se c'è un token per capire se è loggato o è un ospite
    this.isLogged.set(!!localStorage.getItem('auth_token'));
    this.loadGallery();   
  }

  loadGallery() {
    this.isLoading.set(true);
    this.sketchService.getGallery().subscribe({
      next: (response: any) => {
        // Estraiamo i disegni dalla risposta del backend
        this.sketchesList.set(response.data.sketches);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore nel caricamento della galleria:', err);
        this.isLoading.set(false);
      }
    });
  }
}
