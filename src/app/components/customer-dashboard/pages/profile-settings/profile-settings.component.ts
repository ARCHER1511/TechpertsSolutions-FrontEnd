import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../Services/api.service';
import { ImageUtilityService } from '../../../../Services/image-utility.service';
import { Subscription } from 'rxjs';

interface CustomerProfile {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  country?: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginDate?: string;
}

@Component({
  selector: 'app-customer-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class CustomerProfileSettingsComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private imageUtilityService = inject(ImageUtilityService);
  private subscriptions: Subscription[] = [];

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  notificationForm!: FormGroup;

  profile: CustomerProfile | null = null;
  loading = true;
  saving = false;
  error = '';
  success = '';

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  profilePhotoUrl: string = 'assets/Images/default-profile.jpg';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  notificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    maintenanceUpdates: true,
    deliveryUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  };

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadProfilePhoto();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadProfilePhoto(): void {
    const userId = localStorage.getItem('customerId') || localStorage.getItem('userId');
    const storedPhotoName = localStorage.getItem('profilePhotoUrl') || 'photo';
    
    if (userId) {
      // Try to get profile image from API first
      this.subscriptions.push(
        this.imageUtilityService.getProfileImageUrlFromAPI(userId, storedPhotoName).subscribe({
          next: (imageUrl) => {
            this.profilePhotoUrl = imageUrl;
          },
          error: (error) => {
            console.warn('Failed to load profile image from API, using static URL:', error);
            // Fallback to static URL
            this.profilePhotoUrl = this.imageUtilityService.getProfileImageUrl(userId, storedPhotoName);
          }
        })
      );
    } else {
      // No user ID, use default profile image
      this.profilePhotoUrl = 'assets/Images/default-profile.jpg';
    }
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.maxLength(50)]],
      country: ['', [Validators.maxLength(50)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      pushNotifications: [true],
      orderUpdates: [true],
      maintenanceUpdates: [true],
      deliveryUpdates: [true],
      systemAlerts: [true],
      marketingEmails: [false]
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  async loadProfile(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Mock profile data for now - replace with actual API call
      this.profile = {
        id: localStorage.getItem('customerId') || '1',
        fullName: localStorage.getItem('userName') || 'Customer User',
        userName: localStorage.getItem('userName') || 'customer',
        email: 'customer@example.com',
        phoneNumber: '+1234567890',
        address: '123 Main St, City, Country',
        city: 'City',
        country: 'Country',
        profileImageUrl: this.profilePhotoUrl || undefined,
        role: 'Customer',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
      };

      this.profileForm.patchValue({
        fullName: this.profile?.fullName || '',
        userName: this.profile?.userName || '',
        email: this.profile?.email || '',
        phoneNumber: this.profile?.phoneNumber || '',
        address: this.profile?.address || '',
        city: this.profile?.city || '',
        country: this.profile?.country || ''
      });

      this.notificationForm.patchValue(this.notificationSettings);
      this.loading = false;
    } catch (error) {
      console.error('Error loading profile:', error);
      this.error = 'Failed to load profile information';
      this.loading = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB';
        return;
      }

      this.selectedFile = file;
      this.imagePreview = URL.createObjectURL(file);
      this.error = '';
    }
  }

  async uploadProfileImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.saving = true;
    this.error = '';

    try {
      // Mock upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful upload
      const mockImageUrl = URL.createObjectURL(this.selectedFile);
      this.profilePhotoUrl = mockImageUrl;
      localStorage.setItem('profilePhotoUrl', mockImageUrl);
      
      this.success = 'Profile image uploaded successfully';
      this.selectedFile = null;
      this.imagePreview = null;
      
      setTimeout(() => this.success = '', 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      this.error = 'Failed to upload image';
    } finally {
      this.saving = false;
    }
  }

  async updateProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    this.saving = true;
    this.error = '';

    try {
      // Mock update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.success = 'Profile updated successfully';
      setTimeout(() => this.success = '', 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.error = 'Failed to update profile';
    } finally {
      this.saving = false;
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) return;

    this.saving = true;
    this.error = '';

    try {
      // Mock password change - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.success = 'Password changed successfully';
      this.passwordForm.reset();
      setTimeout(() => this.success = '', 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      this.error = 'Failed to change password';
    } finally {
      this.saving = false;
    }
  }

  async updateNotificationSettings(): Promise<void> {
    this.saving = true;
    this.error = '';

    try {
      // Mock update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.success = 'Notification settings updated successfully';
      setTimeout(() => this.success = '', 3000);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      this.error = 'Failed to update notification settings';
    } finally {
      this.saving = false;
    }
  }

  // Helper methods
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['email']) return 'Please enter a valid email';
      if (field.errors?.['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors?.['pattern']) return `Please enter a valid ${fieldName}`;
    }
    return '';
  }

  togglePasswordVisibility(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
    switch (field) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = '+' + value;
    }
    this.profileForm.patchValue({ phoneNumber: value });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/Images/default-profile.jpg';
    }
  }
} 