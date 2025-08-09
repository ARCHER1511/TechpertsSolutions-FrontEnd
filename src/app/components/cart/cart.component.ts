import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartItemReadDTO, CartService } from '../../Services/cart.service';
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
  CartItems: CartItemReadDTO[] = [];
  isCheckingOut = false;

  constructor(
    private cartService: CartService,  // use camelCase by convention
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
  this.cartService.getCart().subscribe({
    next: (res) => {
      if (res.success && res.data) {
        console.log(res);
        this.CartItems = res.data.cartItems;  // <-- direct assign
        this.cartService.updateCartState(this.CartItems); // You may need to adjust this method later to accept CartItemReadDTO[]
      } else {
        this.CartItems = [];
        this.toastr.warning('Failed to load cart items: ' + res.message);
      }
    },
    error: (err) => {
      console.error('Failed to load cart:', err);
      this.toastr.error('Failed to load cart items');
      this.CartItems = [];
    }
  });
}


  addToCart(productId: string): void {
    this.cartService.addItem(productId).subscribe(() => this.loadCart());
  }

  updateItem(item: CartItem): void {
    this.cartService.updateItem(item).subscribe(() => this.loadCart());
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe(() => this.loadCart());
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
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

    const checkoutData = {
  notes: `Order total: ${this.getTotal()} EGP`,
  items: this.CartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,      // directly from CartItemReadDTO
    UnitPrice: item.unitPrice // directly from CartItemReadDTO
  }))
};


    console.log('📤 Sending checkout data:', checkoutData);

    this.cartService.checkout(checkoutData).subscribe({
      next: (res) => {
        console.log('✅ Checkout successful:', res);
        this.toastr.success('Order placed successfully!');
        this.isCheckingOut = false;

        // Clear cart after successful checkout
        this.cartService.clearCart().subscribe(() => {
          this.loadCart();
        });

        this.router.navigate(['/order']);
      },
      error: (err) => {
        console.error('❌ Checkout failed:', err);
        this.isCheckingOut = false;

        if (err.error?.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Checkout failed. Please try again.');
        }
      }
    });
  }

  getTotal(): number {
  return this.CartItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
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
