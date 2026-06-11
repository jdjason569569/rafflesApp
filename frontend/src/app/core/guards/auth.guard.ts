import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'] as 'admin' | 'guest' | undefined;
  
  if (expectedRole) {
    const userRole = authService.getRole();
    if (userRole !== expectedRole) {
      if (userRole === 'guest') {
        router.navigate(['/guest-dashboard']);
      } else if (userRole === 'admin') {
        router.navigate(['/admin-dashboard']);
      } else {
        router.navigate(['/login']);
      }
      return false;
    }
  }

  return true;
};
