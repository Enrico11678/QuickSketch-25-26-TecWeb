import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(emailUtente: string, passwordUtente: string) {
    const body = {
      email: emailUtente,
      password: passwordUtente
    };

    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap(risposta => {
        if (risposta && risposta.data && risposta.data.token) {
          localStorage.setItem('auth_token', risposta.data.token); 
          console.log('Token salvato con successo nel localStorage!');
        } else {
          console.error('Il backend ha risposto OK, ma la struttura del token non è quella attesa!', risposta);
        }
      })
    );
  }

  register(usernameUtente: string, emailUtente: string, passwordUtente: string) {
    const body = {
      username: usernameUtente,
      email: emailUtente,
      password: passwordUtente
    };

    return this.http.post(`${this.apiUrl}/register`, body);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getProfile() {
    return this.http.get<any>('http://localhost:3000/api/users/me/stats');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  deleteAccount() {
    return this.http.delete('http://localhost:3000/api/users/me');
  }
}