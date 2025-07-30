import { NgClass } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { RolesService } from '../../Services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RegisterRequest } from '../../Interfaces/auth';

@Component({
  selector: 'app-regester',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _rolesService = inject(RolesService);

  success: boolean = false;
  errMassage: string = "";
  isLoading: boolean = false;
  availableRoles: any[] = [];
  loadingRoles: boolean = false;

  registerForm = this._FormBuilder.group({
    fullName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: [null, [Validators.required, Validators.email]],
    address: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword: [null, [Validators.required]],
    phoneNumber: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    selectedRole: [null, [Validators.required]]
  }, { validators: this.confirmPassword });

  registSub!: Subscription;

  ngOnInit(): void {
    this.loadRegistrationOptions();
  }

  loadRegistrationOptions(): void {
    this.loadingRoles = true;
    this._rolesService.getRegistrationOptions().subscribe({
      next: (response) => {
        if (response.success && response.data?.roles) {
          this.availableRoles = response.data.roles;
        } else {
          // Fallback to default roles if API response is empty
          this.availableRoles = [
            { id: 'Customer', name: 'Customer', description: 'Regular customer account for shopping and PC building' },
            { id: 'TechCompany', name: 'Tech Company', description: 'Technology company account for maintenance services' },
            { id: 'DeliveryPerson', name: 'Delivery Person', description: 'Delivery person account for order fulfillment' },
            { id: 'Admin', name: 'Admin', description: 'Administrator account with full system access' }
          ];
        }
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Error loading registration options:', err);
        this.loadingRoles = false;
        // Fallback to default roles if API fails
        this.availableRoles = [
          { id: 'Customer', name: 'Customer', description: 'Regular customer account for shopping and PC building' },
          { id: 'TechCompany', name: 'Tech Company', description: 'Technology company account for maintenance services' },
          { id: 'DeliveryPerson', name: 'Delivery Person', description: 'Delivery person account for order fulfillment' },
          { id: 'Admin', name: 'Admin', description: 'Administrator account with full system access' }
        ];
      }
    });
  }

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errMassage = "";

      // Prepare registration data using the proper interface
      const registrationData: RegisterRequest = {
        fullName: this.registerForm.value.fullName!,
        userName: this.registerForm.value.userName!,
        email: this.registerForm.value.email!,
        address: this.registerForm.value.address!,
        password: this.registerForm.value.password!,
        confirmPassword: this.registerForm.value.confirmPassword!,
        phoneNumber: this.registerForm.value.phoneNumber!
      };

      // Get the selected role
      const selectedRole = this.registerForm.value.selectedRole!;

      this.registSub = this._authService.register(registrationData, selectedRole).subscribe({
        next: (res) => {
          console.log(res);

          if (res.success) {
            this.success = true;
            // Store user roles if provided in response
            if (res.data?.userRoles) {
              localStorage.setItem('userRoles', JSON.stringify(res.data.userRoles));
            }
            setTimeout(() => {
              this._router.navigate(['/log-in'])
            }, 1000);
          } else {
            this.errMassage = res.message || 'Registration failed';
          }

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errMassage = err.error?.message || 'Registration failed';
          console.log(err);
          this.isLoading = false;
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.registSub) {
      this.registSub.unsubscribe();
    }
  }

  confirmPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  getSelectedRoleName(): string {
    const selectedRoleId = this.registerForm.get('selectedRole')?.value;
    const selectedRole = this.availableRoles.find(role => role.id === selectedRoleId);
    return selectedRole ? selectedRole.name : 'No role selected';
  }
}
