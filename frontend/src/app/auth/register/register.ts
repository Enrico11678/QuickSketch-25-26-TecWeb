import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Router serve per cambiare pagina dopo il successo
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: '../auth.scss',
})
export class Register {

  // Definisco i contenitori reattivi per i dati inseriti nel form
  username = signal('');
  email = signal('');
  password = signal('');

  // Variabile per controllare se la password è visibile o no
  showPassword = signal(false);

  // Inietto i servizi: uno per chiamare il backend, uno per cambiare pagina
  private authService = inject(AuthService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Funzione che scatta quando viene premuto il pulsante "Registrati"
  register() {
    console.log('Sto inviando i dati di registrazione al server...');

    this.authService.register(this.username(), this.email(), this.password()).subscribe({
      next: (rispostaDelServer) => {
        console.log('Registrazione completata!', rispostaDelServer);
        alert('Account creato con successo! Ora puoi accedere.');

        this.router.navigate(['/login']);
      },
      error: (errore) => {
        console.error('Errore durante la registrazione:', errore);
        alert('Errore: ' + (errore.error?.description || 'Registrazione fallita'));
      }
    });
  }
}
