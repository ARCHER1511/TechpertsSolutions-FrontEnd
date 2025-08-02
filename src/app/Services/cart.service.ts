import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, throwError } from 'rxjs';
import { Environment } from './../Environment/environment';
import { CheckoutRequestDTO } from '../Interfaces/iorder';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  discountPrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _baseUrl = Environment.baseUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getCustomerId(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('customerId');
  }

  getCart(): Observable<CartItem[]> {
    if (!this.isBrowser) return of([]);
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    return this.http.get<{ data: { cartItems: any[] } }>(`${this._baseUrl}/Cart/${userId}`)
      .pipe(
        map(res => {
          const rawItems = res?.data?.cartItems || [];
          return rawItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            product: {
              id: item.productId,
              name: item.productName,
              price: item.price,
              imageUrl: item.imageUrl,
              discountPrice: item.discountPrice
            }
          }));
        })
      );
  }

  addItem(id: string): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot add item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    // Send JSON data instead of FormData for [FromBody] binding
    const requestBody = {
      productId: id,
      quantity: 1
    };

    return this.http.post(`${this._baseUrl}/Cart/${userId}/items`, requestBody);
  }

  updateItem(item: CartItem): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot update item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    // Send JSON data instead of FormData for [FromBody] binding
    const requestBody = {
      productId: item.productId,
      quantity: item.quantity
    };

    return this.http.put(`${this._baseUrl}/Cart/${userId}/items`, requestBody);
  }

  removeItem(productId: string): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot remove item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
    return this.http.delete(`${this._baseUrl}/Cart/${userId}/items/${productId}`);
  }

  clearCart(): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot clear cart on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
    return this.http.delete(`${this._baseUrl}/Cart/${userId}/clear`);
  }

  checkout(checkoutData?: Partial<CheckoutRequestDTO>): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot checkout on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
    
    // Create a more comprehensive checkout request
    const checkoutRequest = {
      customerId: userId,
      orderDate: new Date().toISOString(),
      status: 'Pending',
      ...checkoutData
    };
    
    console.log('🛒 Sending checkout request:', checkoutRequest);
    
    // Add headers to help with potential issues
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return this.http.post(`${this._baseUrl}/Cart/${userId}/checkout`, checkoutRequest, { headers });
  }

  calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    );
  }

  private itemsCountSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);
  private animateCartSubject = new BehaviorSubject<boolean>(false);

  get itemCount$(): Observable<number> {
    return this.itemsCountSubject.asObservable();
  }

  get totalPrice$(): Observable<number> {
    return this.totalPriceSubject.asObservable();
  }

  get animateCart$(): Observable<boolean> {
    return this.animateCartSubject.asObservable();
  }

  updateCartState(cartItems: CartItem[]) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.calculateTotal(cartItems);

    this.itemsCountSubject.next(totalItems);
    this.totalPriceSubject.next(totalPrice);
    this.animateCartSubject.next(true);

    setTimeout(() => this.animateCartSubject.next(false), 500);
  }

  initializeCartState(): void {
    if (!this.isBrowser) return;

    const userId = this.getCustomerId();
    if (!userId) return;

    this.getCart().subscribe({
      next: (items) => {
        this.updateCartState(items);
      },
      error: (err) => {
        console.error('Failed to initialize cart state:', err);
      }
    });
  }
}
