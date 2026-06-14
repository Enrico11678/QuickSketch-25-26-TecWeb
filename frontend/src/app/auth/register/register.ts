import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; 
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

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.notificationService.show('Account creato con successo!', 'success');
        this.router.navigate(['/login']);
      },
      error: (errore) => {
        const messaggio = errore.error?.message || errore.error?.description || 'Registrazione fallita';
        this.notificationService.show(messaggio, 'error');
      }
    });
  }
}
