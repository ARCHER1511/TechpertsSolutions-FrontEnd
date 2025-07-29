import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { jwtDecode } from 'jwt-decode';

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

  setRegisterForm(data: object): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/Authentication/register`, data);
  }

  setloginForm(data: { Email: string; Password: string; RememberMe: boolean }): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/Authentication/login`, data);
  }

  saveUserData(): void {
    if (!this._isBrowser) return;

    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        this.userData = jwtDecode(token);
        this.customerId = localStorage.getItem('userId');
        this.userName = localStorage.getItem('userName');

        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(this.userName);
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

    this.userData = null;
    this.customerId = null;
    this.userName = null;

    this.isLoggedInSubject.next(false);
    this.userNameSubject.next(null);
  }
}
