import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuessService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/guesses';
  
  // Invia un tentativo al backend POST
  makeGuess(sketchId: number, attemptText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { sketchId, attemptText });
  }

  // Recupera lo storico dei tentativi per un disegno GET
  getPreviousGuesses(sketchId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sketch/${sketchId}`);
  }
}
