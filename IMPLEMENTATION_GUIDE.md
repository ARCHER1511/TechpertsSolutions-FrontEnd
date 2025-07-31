# 🚀 Implementation Guide

## 📋 Overview
This guide provides step-by-step instructions for implementing the pages and components outlined in the Page-Level Requirements document, following the existing styling patterns and using the comprehensive API service.

## 🎨 Styling Implementation

### 1. Dark Mode CSS Variables
Add these variables to your component CSS files:

```css
/* === Dark Mode Variables === */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --text-color: #212529;
  --bg-color: #ffffff;
  --card-bg: #ffffff;
  --border-color: #dee2e6;
  --shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --glass-bg: rgba(33, 37, 41, 0.85);
  --glass-border: rgba(255, 255, 255, 0.05);
}

body.dark-mode {
  --text-color: #ffffff;
  --bg-color: #212529;
  --card-bg: #343a40;
  --border-color: #495057;
  --shadow: 0 0.125rem 0.25rem rgba(255, 255, 255, 0.075);
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.05);
}
```

### 2. Common Component Styles
Use these base styles for all components:

```css
/* === Common Component Styles === */
.modern-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  color: var(--text-color);
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

body.dark-mode .modern-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(255, 255, 255, 0.1);
}

.modern-btn {
  background: linear-gradient(145deg, var(--primary-color), #0056b3);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(145deg, #0056b3, var(--primary-color));
}

.modern-btn-secondary {
  background: linear-gradient(145deg, var(--secondary-color), #5a6268);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.modern-btn-secondary:hover {
  transform: translateY(-1px);
  background: linear-gradient(145deg, #5a6268, var(--secondary-color));
}

.form-control-modern {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.form-control-modern:focus {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: var(--text-color);
}

body.dark-mode .form-control-modern:focus {
  box-shadow: 0 0 0 0.2rem rgba(102, 178, 255, 0.25);
}
```

## 🏗️ Page Implementation Examples

### 1. Product Catalog Page

#### Component TypeScript
```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService, ProductDTO, CategoryDTO, SubCategoryDTO } from '../Services/api.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit {
  products: ProductDTO[] = [];
  categories: CategoryDTO[] = [];
  subCategories: SubCategoryDTO[] = [];
  
  // Filters
  selectedCategory: string = '';
  selectedSubCategory: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 12;
  totalItems: number = 0;
  
  // Loading states
  loading: boolean = false;
  loadingCategories: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
      complete: () => {
        this.loadingCategories = false;
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    const params = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      categoryEnum: this.selectedCategory,
      subCategoryName: this.selectedSubCategory,
      search: this.searchTerm
    };

    this.apiService.getAllProducts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data.items;
          this.totalItems = response.data.totalCount;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCategoryChange(): void {
    this.selectedSubCategory = '';
    this.currentPage = 1;
    this.loadSubCategories();
    this.loadProducts();
  }

  loadSubCategories(): void {
    if (this.selectedCategory) {
      this.apiService.getSubCategoriesByCategory(this.selectedCategory).subscribe({
        next: (response) => {
          if (response.success) {
            this.subCategories = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading subcategories:', error);
        }
      });
    } else {
      this.subCategories = [];
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  addToCart(product: ProductDTO): void {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      // Handle not logged in
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity: 1,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    };

    this.apiService.addToCart(customerId, cartItem).subscribe({
      next: (response) => {
        if (response.success) {
          // Show success message
          console.log('Added to cart successfully');
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  addToWishlist(product: ProductDTO): void {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      // Handle not logged in
      return;
    }

    this.apiService.addToWishlist(customerId, product.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Show success message
          console.log('Added to wishlist successfully');
        }
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
      }
    });
  }
}
```

#### Component HTML
```html
<div class="container-fluid py-4">
  <!-- Header -->
  <div class="row mb-4">
    <div class="col-12">
      <h1 class="text-center mb-3" style="color: var(--text-color);">
        <i class="bi bi-grid-3x3-gap me-2"></i>
        Product Catalog
      </h1>
    </div>
  </div>

  <!-- Filters -->
  <div class="row mb-4">
    <div class="col-12">
      <div class="modern-card p-4">
        <div class="row g-3">
          <!-- Search -->
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control form-control-modern" 
                placeholder="Search products..."
                [(ngModel)]="searchTerm"
                (keyup.enter)="onSearch()"
              >
            </div>
          </div>

          <!-- Category Filter -->
          <div class="col-md-3">
            <select 
              class="form-select form-control-modern" 
              [(ngModel)]="selectedCategory"
              (change)="onCategoryChange()"
            >
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Subcategory Filter -->
          <div class="col-md-3">
            <select 
              class="form-select form-control-modern" 
              [(ngModel)]="selectedSubCategory"
              (change)="loadProducts()"
              [disabled]="!selectedCategory"
            >
              <option value="">All Subcategories</option>
              <option *ngFor="let subCategory of subCategories" [value]="subCategory.name">
                {{ subCategory.name }}
              </option>
            </select>
          </div>

          <!-- Search Button -->
          <div class="col-md-2">
            <button class="btn modern-btn w-100" (click)="onSearch()">
              <i class="bi bi-search me-2"></i>Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Spinner -->
  <div *ngIf="loading" class="row">
    <div class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <!-- Products Grid -->
  <div *ngIf="!loading" class="row g-4">
    <div *ngFor="let product of products" class="col-lg-3 col-md-4 col-sm-6">
      <div class="modern-card h-100 product-card">
        <!-- Product Image -->
        <div class="product-image-container">
          <img 
            [src]="product.imageUrl || 'assets/Images/placeholder.png'" 
            [alt]="product.name"
            class="product-image"
            (error)="$event.target.src='assets/Images/placeholder.png'"
          >
          <div class="product-overlay">
            <button 
              class="btn btn-sm btn-outline-light me-2"
              (click)="addToWishlist(product)"
              title="Add to Wishlist"
            >
              <i class="bi bi-heart"></i>
            </button>
            <button 
              class="btn btn-sm btn-primary"
              (click)="addToCart(product)"
              title="Add to Cart"
            >
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-2" style="color: var(--text-color);">
            {{ product.name }}
          </h6>
          
          <p class="text-muted small mb-2">
            <i class="bi bi-building me-1"></i>
            {{ product.techCompanyName }}
          </p>

          <div class="price-section mb-3">
            <span class="current-price">${{ product.price }}</span>
            <span *ngIf="product.discountPrice" class="original-price ms-2">
              ${{ product.discountPrice }}
            </span>
          </div>

          <div class="mt-auto">
            <button 
              class="btn modern-btn w-100"
              [routerLink]="['/products', product.id]"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Products Message -->
  <div *ngIf="!loading && products.length === 0" class="row">
    <div class="col-12 text-center">
      <div class="modern-card p-5">
        <i class="bi bi-box-seam display-1 text-muted mb-3"></i>
        <h4 style="color: var(--text-color);">No products found</h4>
        <p class="text-muted">Try adjusting your search criteria or browse all categories.</p>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div *ngIf="!loading && totalItems > pageSize" class="row mt-4">
    <div class="col-12">
      <nav aria-label="Product pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <a class="page-link" (click)="onPageChange(currentPage - 1)" style="cursor: pointer;">
              Previous
            </a>
          </li>
          
          <li 
            *ngFor="let page of [].constructor(Math.ceil(totalItems / pageSize)); let i = index" 
            class="page-item"
            [class.active]="currentPage === i + 1"
          >
            <a class="page-link" (click)="onPageChange(i + 1)" style="cursor: pointer;">
              {{ i + 1 }}
            </a>
          </li>
          
          <li class="page-item" [class.disabled]="currentPage === Math.ceil(totalItems / pageSize)">
            <a class="page-link" (click)="onPageChange(currentPage + 1)" style="cursor: pointer;">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</div>
```

#### Component CSS
```css
/* === Product Catalog Styles === */
.product-card {
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

body.dark-mode .product-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(255, 255, 255, 0.1);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.price-section {
  display: flex;
  align-items: center;
}

.current-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-color);
}

.original-price {
  font-size: 0.875rem;
  text-decoration: line-through;
  color: var(--secondary-color);
}

/* Pagination Styles */
.pagination .page-link {
  color: var(--text-color);
  background-color: var(--card-bg);
  border-color: var(--border-color);
  transition: all 0.3s ease;
}

.pagination .page-link:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.pagination .page-item.disabled .page-link {
  color: var(--secondary-color);
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

/* Form Control Styles */
.form-control-modern,
.form-select {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.form-control-modern:focus,
.form-select:focus {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: var(--text-color);
}

.input-group-text {
  background-color: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-color);
}
```

### 2. Service Request - Maintenance Page

#### Component TypeScript
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, MaintenanceCreateDTO, MaintenanceNearestDTO } from '../Services/api.service';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.css']
})
export class MaintenanceRequestComponent implements OnInit {
  maintenanceForm: FormGroup;
  nearestTechCompanies: MaintenanceNearestDTO[] = [];
  selectedFiles: File[] = [];
  loading: boolean = false;
  loadingTechCompanies: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.maintenanceForm = this.fb.group({
      techCompanyId: ['', Validators.required],
      warrantyId: [''],
      notes: ['', Validators.maxLength(500)],
      deliveryOption: [false]
    });
  }

  ngOnInit(): void {
    this.loadNearestTechCompanies();
  }

  loadNearestTechCompanies(): void {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      // Handle not logged in
      return;
    }

    this.loadingTechCompanies = true;
    this.apiService.getNearestMaintenance(customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.nearestTechCompanies = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading tech companies:', error);
      },
      complete: () => {
        this.loadingTechCompanies = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        // Handle not logged in
        return;
      }

      this.loading = true;
      const formData = this.maintenanceForm.value;
      
      const maintenanceRequest: MaintenanceCreateDTO = {
        customerId: customerId,
        techCompanyId: formData.techCompanyId,
        warrantyId: formData.warrantyId || undefined,
        status: 'Requested',
        notes: formData.notes
      };

      this.apiService.createMaintenance(maintenanceRequest).subscribe({
        next: (response) => {
          if (response.success) {
            // Show success message and redirect
            console.log('Maintenance request created successfully');
            // Reset form
            this.maintenanceForm.reset();
            this.selectedFiles = [];
          }
        },
        error: (error) => {
          console.error('Error creating maintenance request:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
```

#### Component HTML
```html
<div class="container py-4">
  <!-- Header -->
  <div class="row mb-4">
    <div class="col-12">
      <h1 class="text-center mb-3" style="color: var(--text-color);">
        <i class="bi bi-tools me-2"></i>
        Request Maintenance Service
      </h1>
      <p class="text-center text-muted">
        Submit a maintenance request and we'll connect you with the nearest tech company
      </p>
    </div>
  </div>

  <div class="row">
    <!-- Main Form -->
    <div class="col-lg-8">
      <div class="modern-card p-4">
        <h4 class="mb-4" style="color: var(--text-color);">
          <i class="bi bi-clipboard-check me-2"></i>
          Service Details
        </h4>

        <form [formGroup]="maintenanceForm" (ngSubmit)="onSubmit()">
          <!-- Tech Company Selection -->
          <div class="mb-4">
            <label class="form-label" style="color: var(--text-color);">
              <i class="bi bi-building me-2"></i>
              Select Tech Company *
            </label>
            <select 
              class="form-select form-control-modern" 
              formControlName="techCompanyId"
              [class.is-invalid]="maintenanceForm.get('techCompanyId')?.invalid && maintenanceForm.get('techCompanyId')?.touched"
            >
              <option value="">Choose a tech company...</option>
              <option *ngFor="let company of nearestTechCompanies" [value]="company.id">
                {{ company.techCompanyName }} - {{ company.distance }}km away
              </option>
            </select>
            <div *ngIf="maintenanceForm.get('techCompanyId')?.invalid && maintenanceForm.get('techCompanyId')?.touched" class="invalid-feedback">
              Please select a tech company.
            </div>
          </div>

          <!-- Warranty Information -->
          <div class="mb-4">
            <label class="form-label" style="color: var(--text-color);">
              <i class="bi bi-shield-check me-2"></i>
              Warranty ID (Optional)
            </label>
            <input 
              type="text" 
              class="form-control form-control-modern" 
              formControlName="warrantyId"
              placeholder="Enter warranty ID if applicable"
            >
          </div>

          <!-- File Upload -->
          <div class="mb-4">
            <label class="form-label" style="color: var(--text-color);">
              <i class="bi bi-image me-2"></i>
              Upload Images (Optional)
            </label>
            <div class="file-upload-area">
              <input 
                type="file" 
                class="form-control form-control-modern" 
                multiple 
                accept="image/*"
                (change)="onFileSelected($event)"
              >
              <small class="text-muted">
                Upload images of the issue (max 5 files, 5MB each)
              </small>
            </div>

            <!-- Selected Files -->
            <div *ngIf="selectedFiles.length > 0" class="mt-3">
              <div *ngFor="let file of selectedFiles; let i = index" class="selected-file">
                <span class="file-name">{{ file.name }}</span>
                <button 
                  type="button" 
                  class="btn btn-sm btn-outline-danger"
                  (click)="removeFile(i)"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-4">
            <label class="form-label" style="color: var(--text-color);">
              <i class="bi bi-chat-text me-2"></i>
              Additional Notes
            </label>
            <textarea 
              class="form-control form-control-modern" 
              formControlName="notes"
              rows="4"
              placeholder="Describe the issue or any additional information..."
              [class.is-invalid]="maintenanceForm.get('notes')?.invalid && maintenanceForm.get('notes')?.touched"
            ></textarea>
            <div *ngIf="maintenanceForm.get('notes')?.invalid && maintenanceForm.get('notes')?.touched" class="invalid-feedback">
              Notes cannot exceed 500 characters.
            </div>
            <small class="text-muted">
              {{ maintenanceForm.get('notes')?.value?.length || 0 }}/500 characters
            </small>
          </div>

          <!-- Delivery Option -->
          <div class="mb-4">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                formControlName="deliveryOption"
                id="deliveryOption"
              >
              <label class="form-check-label" for="deliveryOption" style="color: var(--text-color);">
                <i class="bi bi-truck me-2"></i>
                Request delivery service (additional fee may apply)
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-grid">
            <button 
              type="submit" 
              class="btn modern-btn"
              [disabled]="maintenanceForm.invalid || loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!loading" class="bi bi-send me-2"></i>
              {{ loading ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-lg-4">
      <!-- Nearest Tech Companies -->
      <div class="modern-card p-4 mb-4">
        <h5 class="mb-3" style="color: var(--text-color);">
          <i class="bi bi-geo-alt me-2"></i>
          Nearest Tech Companies
        </h5>

        <div *ngIf="loadingTechCompanies" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div *ngIf="!loadingTechCompanies && nearestTechCompanies.length > 0">
          <div *ngFor="let company of nearestTechCompanies" class="tech-company-item">
            <div class="company-info">
              <h6 class="company-name">{{ company.techCompanyName }}</h6>
              <p class="company-details">
                <i class="bi bi-geo-alt me-1"></i>
                {{ company.distance }}km away
              </p>
              <div class="rating">
                <i *ngFor="let star of [1,2,3,4,5]" 
                   class="bi" 
                   [ngClass]="star <= company.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'">
                </i>
                <span class="ms-2">{{ company.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loadingTechCompanies && nearestTechCompanies.length === 0" class="text-center">
          <i class="bi bi-exclamation-triangle text-warning display-6"></i>
          <p class="text-muted mt-2">No tech companies found nearby</p>
        </div>
      </div>

      <!-- Information Card -->
      <div class="modern-card p-4">
        <h5 class="mb-3" style="color: var(--text-color);">
          <i class="bi bi-info-circle me-2"></i>
          How it works
        </h5>
        <ul class="list-unstyled">
          <li class="mb-2">
            <i class="bi bi-check-circle text-success me-2"></i>
            Submit your maintenance request
          </li>
          <li class="mb-2">
            <i class="bi bi-check-circle text-success me-2"></i>
            Tech company will review and accept
          </li>
          <li class="mb-2">
            <i class="bi bi-check-circle text-success me-2"></i>
            Schedule appointment and get service
          </li>
          <li class="mb-2">
            <i class="bi bi-check-circle text-success me-2"></i>
            Pay securely through our platform
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

#### Component CSS
```css
/* === Maintenance Request Styles === */
.file-upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.file-upload-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.05);
}

.selected-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.file-name {
  color: var(--text-color);
  font-size: 0.875rem;
}

.tech-company-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.tech-company-item:hover {
  border-color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.05);
}

.company-name {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.company-details {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.rating {
  font-size: 0.875rem;
}

/* Form Check Styles */
.form-check-input {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.form-check-label {
  color: var(--text-color);
}

/* Textarea Styles */
textarea.form-control-modern {
  resize: vertical;
  min-height: 100px;
}

/* Invalid Feedback */
.invalid-feedback {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: var(--danger-color);
}

.is-invalid:focus {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
```

## 🔧 Additional Implementation Tips

### 1. Error Handling
Create a shared error handling service:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    let message = 'An unexpected error occurred.';
    
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }
    
    // Show toast notification or alert
    this.showNotification(message, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    // Implement your preferred notification system
    // Could be toast, alert, or custom component
  }
}
```

### 2. Loading States
Create reusable loading components:

```typescript
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
}
```

### 3. Form Validation
Create custom validators:

```typescript
export class CustomValidators {
  static fileSize(maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const files = control.value as File[];
      for (const file of files) {
        if (file.size > maxSize) {
          return { fileSize: { maxSize, actualSize: file.size } };
        }
      }
      return null;
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const files = control.value as File[];
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return { fileType: { allowedTypes, actualType: file.type } };
        }
      }
      return null;
    };
  }
}
```

### 4. Responsive Design
Use Bootstrap's responsive classes and custom media queries:

```css
/* Mobile First Approach */
@media (max-width: 576px) {
  .modern-card {
    margin: 0.5rem;
    border-radius: 0.5rem;
  }
  
  .product-card {
    margin-bottom: 1rem;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

This implementation guide provides a solid foundation for building all the pages outlined in the requirements document while maintaining consistency with the existing codebase and styling patterns. 