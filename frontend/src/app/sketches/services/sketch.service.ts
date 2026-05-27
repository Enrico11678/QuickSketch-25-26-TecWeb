import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  private http = inject(HttpClient);

  private apiSketchesUrl = 'http://localhost:3000/api/sketches';
  private apiWordsUrl = 'http://localhost:3000/api/words';

  // Recupera i disegni dell'utente loggato
  getMySketches() {
    const token = localStorage.getItem('auth_token');

    return this.http.get<any>(`${this.apiSketchesUrl}/me`, {
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

    return this.http.get<any>(this.apiSketchesUrl, { headers });
  }
  
  // Recupera le parole disponibili (non ancora disegnate dall'utente)
  getAvailableWords() {
    const token = localStorage.getItem('auth_token');

    return this.http.get<any[]>(this.apiWordsUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Invia lo sketch al backend per salvarlo dal database
  createSketch(wordId: number, contentBase64: string) {
    const token = localStorage.getItem('auth_token');

    // Prepara il body della POST per la funzione createSketch del backend
    const body = {
      wordId: wordId,
      content: contentBase64
    };

    return this.http.post<any>(this.apiSketchesUrl, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
