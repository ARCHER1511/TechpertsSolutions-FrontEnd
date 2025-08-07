import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  CartItems: CartItem[] = [];
  isCheckingOut = false;

  constructor(
    private CartService: CartService,
    private toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.CartService.getCart().subscribe({
      next: (items: CartItem[]) => {
        console.log('📦 Cart items loaded:', items);
        this.CartItems = items;
        this.CartService.updateCartState(this.CartItems);
      },
      error: (err: any) => {
        console.error('❌ Failed to load cart:', err);
        this.toastr.error('Failed to load cart items');
      },
    });
  }

  addToCart(productId: string): void {
    this.CartService.addItem(productId).subscribe(() => this.loadCart());
  }

  updateItem(item: CartItem): void {
    this.CartService.updateItem(item).subscribe(() => this.loadCart());
  }

  removeItem(productId: string): void {
    this.CartService.removeItem(productId).subscribe(() => this.loadCart());
  }

  clearCart(): void {
    this.CartService.clearCart().subscribe(() => this.loadCart());
  }

  checkout(): void {
    if (this.CartItems.length === 0) {
      this.toastr.warning('Your cart is empty');
      return;
    }

    this.isCheckingOut = true;
    
    console.log('🛒 Starting checkout process...');
    console.log('📦 Cart items:', this.CartItems);
    console.log('💰 Total amount:', this.getTotal());
    
    // For now, we'll send basic checkout data
    // You can extend this to include shipping address, payment method, etc.
    const checkoutData = {
      notes: `Order total: ${this.getTotal()} EGP`,
      items: this.CartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0,
        UnitPrice: item.product?.UnitPrice || 0
      }))
    };

    console.log('📤 Sending checkout data:', checkoutData);

    this.CartService.checkout(checkoutData).subscribe({
      next: (res) => {
        console.log('✅ Checkout successful:', res);
        this.toastr.success('Order placed successfully!');
        this.isCheckingOut = false;
        
        // Clear cart after successful checkout
        this.CartService.clearCart().subscribe(() => {
          this.loadCart();
        });
      },
      error: (err) => {
        console.error('❌ Checkout failed:', err);
        console.error('❌ Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        this.isCheckingOut = false;
        
        // Show specific error message
        if (err.error?.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Checkout failed. Please try again.');
        }
      }
    });
    this._router.navigate(['/order'])
  }

  getTotal(): number {
    return this.CartItems.reduce(
      (sum, item) => sum + (item.product?.UnitPrice ?? 0) * item.quantity,
      0
    );
  }

  hasDiscount(item: CartItem): boolean {
    return (
      item.product?.discountPrice !== undefined &&
      item.product?.UnitPrice !== undefined &&
      item.product.discountPrice < item.product.UnitPrice
    );
  }
}
