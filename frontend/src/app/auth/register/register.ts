import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Router serve per cambiare pagina dopo il successo
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['../auth.scss'],
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/.*[^a-zA-Z0-9 ].*/)]]
  });

  showPassword = signal(false);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Funzione che scatta quando viene premuto il pulsante "Registrati"
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('Sto inviando i dati di registrazione al server...');

    // Estraggo i dati sicuri dal form
    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
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
