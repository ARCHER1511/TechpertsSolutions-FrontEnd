import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginPayload } from '../../Interfaces/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  private readonly fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService)

  success = false;
  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    ]]
  });

  loginSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    if (typeof email === 'string' && typeof password === 'string') {
      const payload: LoginPayload = {
        Email: email,
        Password: password,
        RememberMe: true
      };

      console.log('Sending login payload:', payload);

      this._authService.setloginForm(payload).subscribe({
        next: (res) => {
          console.log('Login response:', res);

          const token = res.data?.token;
          const customerId = res.data?.customerId;
          const userName = res.data?.userName;
          const userCart = res.data?.userCart;


          if (token) {
            console.log(token);
            
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('userToken', token);
              if(customerId) localStorage.setItem('customerId', customerId);
              if(userName) localStorage.setItem('userName', userName)
              if(userCart) localStorage.setItem('userCart', userCart.id)

            }

            this._authService.userData = { userName, customerId };
            this._router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid login response: token or userId missing.';
          }

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login failed', err);
          if (err.error?.errors) {
            const messages = Object.values(err.error.errors).flat();
            this.errorMessage = messages.join(' | ');
          } else {
            this.errorMessage = err.error?.message || 'Login failed';
          }
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email and password.';
      this.isLoading = false;
    }
  } else {
    this.loginForm.markAllAsTouched();
  }
}

}
