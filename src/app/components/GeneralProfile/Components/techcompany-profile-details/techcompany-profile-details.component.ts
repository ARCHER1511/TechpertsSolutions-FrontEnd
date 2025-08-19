import { Component, inject, Input, OnInit} from '@angular/core';
import { TechCompanyProfileDTO } from '../../../../Interfaces/GenProfileInterfaces/TechCompanyProfileDTO';
import { ProfilesService } from '../../../../Services/profiles.service';
import { NgFor, NgIf } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Environment } from '../../../../Environment/environment';
import { ProductCardDTO } from '../../../../Interfaces/GenProfileInterfaces/ProductCardDTO';


@Component({
  standalone: true,
  imports: [NgIf, NgFor],
  selector: 'app-techcompany-profile-details',
  templateUrl: './techcompany-profile-details.component.html'
})
export class TechCompanyProfileDetailsComponent implements OnInit {
  @Input() userId!: string | undefined;
  company?: TechCompanyProfileDTO;

  @Output() addToCart = new EventEmitter<string>();

  private _router = inject(Router);
  private _wishlistService = inject(WishlistService);
  private _toastr = inject(ToastrService);

  constructor(private profileService: ProfilesService) {}

  ngOnInit(): void {
    this.profileService.getTechCompanyProfile(this.userId).subscribe({
      next: (data) => (this.company = data.data),
      error: (err) => console.error('Error loading company profile', err)
    });
  }

  onAddToCart(product: ProductCardDTO) {
    this.addToCart.emit(product.id);
    this._toastr.success(`${product.name} added to cart!`);
  }

  goToProduct(id: string) {
    this._router.navigate(['/product-details', id]);
  }

  getMainImageUrl(product?: ProductCardDTO): string {
    if (!product || !product.imageUrl) {
      return '../../../../../assets/Images/about.jpg'; // fallback
    }

    const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
    return product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `${backendBase}/${product.imageUrl.replace(/^\/+/, '')}`;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../../assets/Images/about.jpg';
  }

  onAddToWishlist(product: ProductCardDTO) {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this._toastr.error('Please login first');
      return;
    }

    this._wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
      next: () => {
        this._toastr.success(`${product.name} added to wishlist!`);
        this._wishlistService.initializeWishlistState();
      },
      error: (err) => {
        console.error('❌ Wishlist error:', err);
        this._toastr.error(`Item already in wishlist: ${product.name}`);
      }
    });
  }
}