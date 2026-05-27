import { Routes } from '@angular/router';
import { Login } from './auth/login/login'
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { ProfilePage } from './profile-page/profile-page';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard },
    { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];