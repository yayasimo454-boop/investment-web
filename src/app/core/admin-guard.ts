import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser();

  if (user && user.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};