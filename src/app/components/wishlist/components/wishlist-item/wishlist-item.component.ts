import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WishListItemReadDTO } from '../../../../Interfaces/wishlist';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.css']
})
export class WishlistItemComponent {
  @Input() item!: WishListItemReadDTO;
  @Output() remove = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<string>();

  onRemoveClick(): void {
    this.remove.emit(this.item.productId);
  }

  onAddToCartClick(): void {
    this.addToCart.emit(this.item.productId);
  }
}