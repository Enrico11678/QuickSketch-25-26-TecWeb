import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Aggiungo il controllo di stato per permettere all'HTML di nascondere i link privati
  isLogged = this.authService.isLoggedIn();

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}