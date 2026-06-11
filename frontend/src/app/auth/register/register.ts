import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Router serve per cambiare pagina dopo il successo
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../services/notification.service';

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
  private notificationService = inject(NotificationService);

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
    // 1. Debug: vediamo se il form è valido
    if (this.registerForm.invalid) {
      console.log('DEBUG: Form non valido!');
      // Esploriamo cosa c'è che non va nei campi
      Object.keys(this.registerForm.controls).forEach(key => {
        const controlErrors = this.registerForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`DEBUG: Campo '${key}' errori:`, controlErrors);
        }
      });
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('DEBUG: Form valido, invio in corso...');

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (rispostaDelServer) => {
        console.log('DEBUG: Registrazione avvenuta con successo!', rispostaDelServer);
        this.notificationService.show('Account creato con successo!', 'success');
        this.router.navigate(['/login']);
      },
      error: (errore) => {
        // 2. Debug: vediamo cosa risponde esattamente il server
        console.error('DEBUG: Errore dalla chiamata API:', errore);
        const messaggio = errore.error?.message || errore.error?.description || 'Registrazione fallita';
        this.notificationService.show(messaggio, 'error');
      }
    });
  }
}
