import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inietto lo strumento di Angular per fare le chiamate di rete
  private http = inject(HttpClient);

  // Definisco l'indirizzo base del server Node.js
  private apiUrl = 'http://localhost:3000/api/auth';

  login(emailUtente: string, passwordUtente: string) {
    const body = {
      email: emailUtente,
      password: passwordUtente
    };

    // Faccio una richiesta POST all'indirizzo http://localhost:3000/api/auth/login
    // e restituisco l'Observable (il "sottoscrivibile") al componente
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap(risposta => {
        if (risposta && risposta.data && risposta.data.token) {
          localStorage.setItem('auth_token', risposta.data.token); // Salviamo il token
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

    // Faccio una richiesta POST all'indirizzo http://localhost:3000/api/auth/register
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  // Verifica se il token esiste nel localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Recupera i dati del profilo dell'utente loggato
  getProfile() {
    // Prendiamo il token dal localStorage
    const token = localStorage.getItem('auth_token');

    // Facciamo la chiamata GET allegando il token negli Header
    return this.http.get<any>('http://localhost:3000/api/users/me/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Rimuove il token
  logout() {
    localStorage.removeItem('auth_token');
  }
}