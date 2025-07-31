import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { IProduct } from '../../../../Interfaces/iproduct';
import { CartService } from '../../../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../../../Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { ImageUtilityService } from '../../../../Services/image-utility.service';
import { ImageUrlPipe } from '../../../../Pipes/image-url.pipe';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent implements OnInit {
  @Input() productC!: IProduct;
  @Output() addToCart = new EventEmitter<string>();

  _router = inject(Router);
  _cartService = inject(CartService);
  _wishlistService = inject(WishlistService);
  _toastr = inject(ToastrService);
  _imageUtility = inject(ImageUtilityService);

  ngOnInit(): void {
    console.log('Product item initialized with:', this.productC);
  }

  onAddToCart() {
    this.addToCart.emit(this.productC.id);
  }

  goToProduct(id: string) {
    this._router.navigate(['/product-details', id]);
  }

  onImgError(event: Event) {
    // Use the new image utility service to construct the correct image URL
    const imageUrl = this._imageUtility.getProductImageUrl(this.productC.id);
    (event.target as HTMLImageElement).src = imageUrl;
  }

  /**
   * Get the correct image URL for the product
   * @returns The formatted image URL
   */
  getProductImageUrl(): string {
    // If the product already has a valid imageUrl, use it
    if (this.productC.imageUrl && this._imageUtility.isValidImageUrl(this.productC.imageUrl)) {
      return this.productC.imageUrl;
    }
    
    // Otherwise, construct the URL using the new pattern
    return this._imageUtility.getProductImageUrl(this.productC.id);
  }

  onAddToWishlist(product: IProduct) {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this._toastr.error('Please login first');
      return;
    }

    console.log('💖 Adding to wishlist:', { productId: product.id, customerId });

    this._wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
      next: () => {
        this._toastr.success('Added to wishlist!');
        this._wishlistService.initializeWishlistState();
      },
      error: (err) => {
        console.error('❌ Wishlist API error:', err);
        this._toastr.error(`Item already in wishlist ${product.name}`);
      }
    });
  }
}
