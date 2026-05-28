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
    return this.http.get<any>(`${this.apiSketchesUrl}/me`);
  }

  // Recupera tutta la galleria pubblica
  getGallery() {
    return this.http.get<any>(this.apiSketchesUrl);
  }
  
  // Recupera le parole disponibili (non ancora disegnate dall'utente)
  getAvailableWords() {
    return this.http.get<any[]>(this.apiWordsUrl);
  }

  // Invia lo sketch al backend per salvarlo nel database
  createSketch(wordId: number, contentBase64: string) {
    const body = {
      wordId: wordId,
      content: contentBase64
    };
    return this.http.post<any>(this.apiSketchesUrl, body);
  }

  // Recupera tutti gli sketch giocabili (esclude i propri e quelli già indovinati/chiusi)
  getPlayableSketches() {
    return this.http.get<any>(`${this.apiSketchesUrl}/playable`);
  }

  // Recupera uno sketch specifico tramite ID
  getSketchById(id: number) {
    return this.http.get<any>(`${this.apiSketchesUrl}/${id}`);
  }

}