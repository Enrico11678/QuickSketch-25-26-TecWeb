import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // Creo due "contenitori" signals per i dati dell'utente
  email = signal('');
  password = signal('');

  // Variabile per controllare se la paswword è visibile o no
  showPassword = signal(false);

  private authService = inject(AuthService);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Aggiunta di questa funzione per non far arrabbiare Angular
  login() {
    console.log('Sto inviando i dati al server...');

    this.authService.login(this.email(), this.password()).subscribe({
      next: (rispostaDelServer) => {
        console.log('Login completato con successo!', rispostaDelServer);
        alert('Accesso eseguito!');
      },
      error: (errore) => {
        console.error('Errore di login:', errore);
        alert('Email o password errati!');
      }
    });
  }

}
