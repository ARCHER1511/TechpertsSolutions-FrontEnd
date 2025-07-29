// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);

  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  if (isBrowser) {
    const token = localStorage.getItem('userToken');  // <-- fix here
    const customerId = localStorage.getItem('customerId');

    if (token && customerId) {
      return true;
    } else {
      return _Router.parseUrl('/login');
    }
  }

  // If not in browser (SSR), block access
  return _Router.parseUrl('/login');
};

