import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: '../auth.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]], // Deve essere pieno e in formato email
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/.*[^a-zA-Z0-9 ].*/)]] // Deve essere pieno e minimo 6 caratteri e avere almeno un carattere speciale
  });

  showPassword = signal(false);

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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('Sto inviando i dati al server...');

    // Estraggo i dati puliti e validati dal form
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
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
