import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/users';
  
  // Recupera la top 5 degli indovinatori
  getTopPlayers(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboard/players?limit=${limit}`);
  }

  // Recupera la top 5 dei disegnatori
  getTopDesigners(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboard/designers?limit=${limit}`);
  }
}
