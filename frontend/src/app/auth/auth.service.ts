import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.post(`${this.apiUrl}/login`, body);
  }
}
