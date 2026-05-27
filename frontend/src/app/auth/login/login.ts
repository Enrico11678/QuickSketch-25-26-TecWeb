import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: '../auth.scss',
})
export class Login {

  // Creo due "contenitori" signals per i dati dell'utente
  email = signal('');
  password = signal('');

  // Variabile per controllare se la password è visibile o no
  showPassword = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Appena si apre la pagina di login, controlla se ha già il token
    if (this.authService.isLoggedIn()) {
      // Se è già loggato lo butta di nuovo nella dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Funzione che scatta quando viene premuto il pulsante "Accedi"
  login() {
    console.log('Sto inviando i dati al server...');

    this.authService.login(this.email(), this.password()).subscribe({
      next: (rispostaDelServer) => {
        console.log('Login completato con successo!', rispostaDelServer);
        this.router.navigate(['/dashboard']);
      },
      error: (errore) => {
        console.error('Errore di login:', errore);
        alert('Email o password errati!');
      }
    });
  }

}
