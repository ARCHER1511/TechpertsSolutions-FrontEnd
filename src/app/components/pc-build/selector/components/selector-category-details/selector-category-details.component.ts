import { Component } from '@angular/core';
import { IProduct, ProductCategory } from '../../../../../Interfaces/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../../Services/category.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { PCAssemblyService } from '../../../../../Services/pcassembly.service';
import { AddComponentToBuildDTO } from '../../../../../Interfaces/ipc-assembly';

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
  adding = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService,
    private pcAssemblyService: PCAssemblyService // <-- Injected
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    console.log(`🏷️ Category Details Component - Category Name: ${name}`);
    this.loadProductsByCategory(name);
  }

  loadProductsByCategory(categoryName: string): void {
    console.log(`🔄 Loading products for category: ${categoryName}`);
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
            discountPrice: catProduct.discountPrice ?? catProduct.price,
            imageUrl: catProduct.imageUrl || '',
            category: response.data.name,
            categoryName: response.data.name,
            subCategoryId: catProduct.subCategoryId ?? '',
            subCategoryName: catProduct.subCategoryName ?? '',
            status: catProduct.status ?? 'Approved',
            specifications: catProduct.specifications || []
          })) || [];
        } else {
          this.error = response.message || 'Failed to load products';
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

  selectProduct(product: IProduct): void {
    const pcAssemblyId = localStorage.getItem('pcAssemblyId');

    if (!pcAssemblyId) {
      this.error = 'No PC build found. Please start a new build.';
      return;
    }

    this.adding = true;

    const dto: AddComponentToBuildDTO = {
  productId: product.id,
  category: product.categoryName as ProductCategory // or product.category if you prefer
};


    this.pcAssemblyService.addComponentToBuild(pcAssemblyId, dto).subscribe({
      next: (response) => {
        this.adding = false;
        if (response.success) {
          const enriched = {
            ...product,
            title: product.name,
            link: `https://example.com/products/${product.id}`,
            category: this.categoryName
          };
          this.router.navigate(['/selector'], { state: { selectedProduct: enriched } });
        } else {
          this.error = response.message || 'Failed to add product to build.';
        }
      },
      error: (err) => {
        console.error('❌ Error adding product to build:', err);
        this.error = 'Something went wrong. Please try again.';
        this.adding = false;
      }
    });
  }
}
