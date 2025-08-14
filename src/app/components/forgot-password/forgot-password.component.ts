import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Add this
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // <-- Add CommonModule here
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const email = this.form.value.email;

    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.message = res.message || 'Reset link sent to your email!';
        this.error = null;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send reset link';
        this.message = null;
      }
    });
  }
}
