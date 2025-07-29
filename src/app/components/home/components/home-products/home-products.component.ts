import { Component } from '@angular/core';
import { IProduct } from '../../../../Interfaces/iproduct';
import { ProductService } from '../../../../Services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../Services/cart.service';
import { ProductItemComponent } from '../../../products/components/product-item/product-item.component';


@Component({
  selector: 'app-home-products',
  standalone: true,
  imports: [CommonModule, ProductItemComponent], 
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css'
})
export class HomeProductsComponent {
  products: IProduct[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(1, 10, 'name', false).subscribe({
      next: (res) => {
        this.products = res.data.items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onAddToCart(productId: string): void {
    const cartItem = { productId, quantity: 1 };
    this.cartService.addItem(cartItem).subscribe({
      next: () => {
        this.cartService.updateCartState([cartItem]);
        alert(`Product added to cart`);
      },
      error: (err) => {
        console.error(err);
        alert('Could not add product to cart');
      }
    });
  }
}
