import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/sketches';

  // Recupera i disegni dell'utente loggato
  getMySketches() {
    const token = localStorage.getItem('auth_token');

    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Recupera tutta la galleria pubblica
  getGallery() {
    const token = localStorage.getItem('auth_token');
    const headers: any = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.http.get<any>(this.apiUrl, { headers });
  } 
  
}
