import { Component } from '@angular/core';
import { IProduct } from '../../../../../Interfaces/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../../Services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector-category-details.component.html',
  styleUrl: './selector-category-details.component.css'
})
export class SelectorCategoryDetailsComponent {
  categoryName = '';
    products: IProduct[] = [];
    loading = false;
    error = '';
  
    constructor(
      private route: ActivatedRoute, 
      private router: Router,
      private categoryService: CategoryService
    ) {}
  
    ngOnInit(): void {
      const name = this.route.snapshot.paramMap.get('name') ?? '';
      console.log(`🏷️ Category Details Component - Category Name: ${name}`);
      this.loadProductsByCategory(name);
    }
  
    loadProductsByCategory(categoryName: string): void {
      console.log(`🔄 Loading products for category Name: ${categoryName}`);
      this.loading = true;
      this.error = '';
  
      this.categoryService.getCategoryByName(categoryName).subscribe({
        next: (response) => {
          console.log(`📦 Category API Response:`, response);
          if (response.success && response.data) {
            this.categoryName = response.data.name;
            this.products = response.data.products?.map(catProduct => ({
              id: catProduct.id,
              name: catProduct.name,
              price: catProduct.price,
              discountPrice: catProduct.price, // Assuming no discount for now
              imageUrl: catProduct.imageUrl || '',
              category: response.data.name,
              categoryName: response.data.name,
              subCategoryId: '',
              subCategoryName: '',
              status: 'Approved', // Default status
              specifications: catProduct.specifications || []
            })) || [];
            console.log(`✅ Loaded ${this.products.length} products for category: ${response.data.name}`);
            console.log(`📋 Products:`, this.products);
          } else {
            this.error = response.message || 'Failed to load products';
            console.error('❌ Category API error:', response.message);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error loading category products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
        }
      });
    }
  
    selectProduct(product: IProduct) {
      console.log(`🎯 Selected product:`, product);
      const enriched = {
        ...product,
        title: product.name,
        link: 'https://example.com/products/' + product.id,
        category: this.categoryName
      };
      console.log(`🎯 Enriched product for selector:`, enriched);
      this.router.navigate(['/selector'], { state: { selectedProduct: enriched } });
    }
}
