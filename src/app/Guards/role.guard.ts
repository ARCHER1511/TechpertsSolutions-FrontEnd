import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { RolesService } from '../Services/roles.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const rolesService = inject(RolesService);

    // Check if user is logged in
    if (!authService.userData || !authService.customerId) {
      router.navigate(['/login']);
      return false;
    }

    // For now, we'll use a simple approach
    // In a real app, you'd check the user's roles from the JWT token or API
    const userRoles = localStorage.getItem('userRoles');
    
    if (userRoles) {
      const roles = JSON.parse(userRoles);
      const hasRequiredRole = allowedRoles.some(role => roles.includes(role));
      
      if (hasRequiredRole) {
        return true;
      }
    }

    // If no roles found or user doesn't have required role
    router.navigate(['/unauthorized']);
    return false;
  };
};

// Specific role guards
export const adminGuard: CanActivateFn = roleGuard(['Admin']);
export const techCompanyGuard: CanActivateFn = roleGuard(['TechCompany']);
export const customerGuard: CanActivateFn = roleGuard(['Customer']);
export const deliveryPersonGuard: CanActivateFn = roleGuard(['DeliveryPerson']); 