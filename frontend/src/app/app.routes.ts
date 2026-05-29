import { Routes } from '@angular/router';
import { Login } from './auth/login/login'
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { ProfilePage } from './profile-page/profile-page';
import { DrawPage } from './sketches/components/draw-page/draw-page';
import { GalleryPage } from './gallery-page/gallery-page';
import { GuessPage } from './sketches/components/guess-page/guess-page';
import { LeaderboardPage } from './stats/components/leaderboard-page/leaderboard-page';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login, title: 'Accedi | QuickSketch' },
    { path: 'register', component: Register, title: 'Registrati | QuickSketch' },
    { path: 'dashboard', component: Dashboard, title: 'Home | QuickSketch' },
    { path: 'gallery', component: GalleryPage, title: 'Galleria | QuickSketch' },
    { path: 'profile', component: ProfilePage, canActivate: [authGuard], title: 'Profilo | QuickSketch' },
    { path: 'draw', component: DrawPage, canActivate: [authGuard], title: 'Disegna | QuickSketch' },
    { path: 'guess/:id', component: GuessPage, canActivate: [authGuard], title: 'Indovina | QuickSketch' },
    { path: 'leaderboard', component: LeaderboardPage, canActivate: [authGuard], title: 'Classifica | QuickSketch' },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];