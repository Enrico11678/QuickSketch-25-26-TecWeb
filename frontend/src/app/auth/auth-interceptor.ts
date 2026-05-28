import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Recupero il token dal localStorage
  const token = localStorage.getItem('auth_token');

  // Se il token esiste, clono la richiesta originale e le attacco l'header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Passo la richiesta clonata (con il token) al backend
    return next(clonedReq);
  }

  // Se non c'è token (es. utente non loggato), passo la richiesta liscia
  return next(req);
};