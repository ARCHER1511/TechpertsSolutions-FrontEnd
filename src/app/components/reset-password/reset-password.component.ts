import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Add this
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // <-- Add CommonModule here
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.error = 'Invalid or missing token.';
    }
  }

  submit() {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const email = this.route.snapshot.queryParamMap.get('email');
    if (!email) {
      this.error = 'Email is missing';
      return;
    }

    const payload = { email, token: this.token, newPassword, confirmPassword };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.message = res.message || 'Password reset successfully!';
        this.error = null;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to reset password';
        this.message = null;
      }
    });
  }
}
