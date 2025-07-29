import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { jwtDecode } from 'jwt-decode';
import { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  AuthResponse 
} from '../Interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _isBrowser = isPlatformBrowser(this._platformId);

  userData: any = null;
  customerId: string | null = null;
  userName: string | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this._isBrowser ? this.hasToken() : false);
  private userNameSubject = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  private hasToken(): boolean {
    return this._isBrowser && !!localStorage.getItem('userToken');
  }

  // Register user with proper interface
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${Environment.baseUrl}/Authentication/register`, data);
  }

  // Login user with proper interface
  login(data: LoginRequest): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${Environment.baseUrl}/Authentication/login`, data);
  }

  // Forgot password
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/Authentication/forgot-password`, data);
  }

  // Reset password
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/Authentication/reset-password`, data);
  }

  // Delete account
  deleteAccount(): Observable<any> {
    return this._HttpClient.delete(`${Environment.baseUrl}/Authentication/delete-account`);
  }

  // Legacy method for backward compatibility
  setRegisterForm(data: object): Observable<any> {
    return this.register(data as RegisterRequest);
  }

  // Legacy method for backward compatibility
  setloginForm(data: { Email: string; Password: string; RememberMe: boolean }): Observable<any> {
    return this.login({
      email: data.Email,
      password: data.Password,
      rememberMe: data.RememberMe
    });
  }

  saveUserData(): void {
    if (!this._isBrowser) return;

    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        this.userData = jwtDecode(token);
        this.customerId = localStorage.getItem('customerId') || localStorage.getItem('userId');
        this.userName = localStorage.getItem('userName');

        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(this.userName);
        
        console.log('Auth Service - Loaded user data:', {
          customerId: this.customerId,
          userName: this.userName,
          techCompanyId: localStorage.getItem('techCompanyId'),
          deliveryPersonId: localStorage.getItem('deliveryPersonId'),
          adminId: localStorage.getItem('adminId')
        });
      } catch (err) {
        console.error('Invalid token:', err);
        this.clearUserData();
      }
    } else {
      this.clearUserData();
    }
  }

  logOut(): void {
    this.clearUserData();
    this._Router.navigate(['/login']);
  }

  initialize(): void {
    if (this._isBrowser) {
      this.saveUserData();
    }
  }

  private clearUserData(): void {
    if (!this._isBrowser) return;

    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('customerId');
    localStorage.removeItem('techCompanyId');
    localStorage.removeItem('deliveryPersonId');
    localStorage.removeItem('adminId');
    localStorage.removeItem('cartId');
    localStorage.removeItem('wishListId');
    localStorage.removeItem('pcAssemblyId');

    this.userData = null;
    this.customerId = null;
    this.userName = null;

    this.isLoggedInSubject.next(false);
    this.userNameSubject.next(null);
  }
}
