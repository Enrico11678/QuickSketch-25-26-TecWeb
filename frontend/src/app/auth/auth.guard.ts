import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Controllo se l'utente ha il token
    if (authService.isLoggedIn()) {
        return true; // Lascia passare l'utente 
    } else {
        // il token non esiste. Rispedisce l'utente al login
        router.navigate(['/login']);
        return false;
    }
};