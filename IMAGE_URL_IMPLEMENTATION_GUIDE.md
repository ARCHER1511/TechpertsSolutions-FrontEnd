# Image URL Implementation Guide

## Overview

This guide explains how to use the new image URL system that follows the pattern: `localhost/7230/assets/controllername/photo`

## 🎯 **What's New**

The application now has a centralized image URL system that ensures all images are fetched using the correct endpoint format:

```
https://localhost:7230/assets/{controllerName}/{photoName}
```

## 📁 **New Files Created**

### 1. `src/app/Services/image-utility.service.ts`
- **Purpose**: Core service for constructing image URLs
- **Key Methods**:
  - `getImageUrl(controllerName, photoName)` - General image URL construction
  - `getProductImageUrl(productId, photoName)` - Product-specific URLs
  - `getCategoryImageUrl(categoryId, photoName)` - Category-specific URLs
  - `getProfileImageUrl(userId, photoName)` - Profile-specific URLs
  - `isValidImageUrl(url)` - URL validation
  - `extractControllerName(url)` - Extract controller from URL
  - `extractPhotoName(url)` - Extract photo name from URL

### 2. `src/app/Pipes/image-url.pipe.ts`
- **Purpose**: Angular pipe for template usage
- **Usage**: `{{ controllerName | imageUrl:photoName }}`

### 3. Updated `src/app/Services/image-upload.service.ts`
- **Added**: Integration with ImageUtilityService
- **New Methods**: `constructImageUrl()`, `constructProductImageUrl()`, etc.

## 🚀 **How to Use**

### Method 1: Using the Service in Components

```typescript
import { ImageUtilityService } from '../Services/image-utility.service';

export class MyComponent {
  constructor(private imageUtility: ImageUtilityService) {}

  getProductImage(productId: string): string {
    return this.imageUtility.getProductImageUrl(productId);
  }

  getCategoryImage(categoryId: string): string {
    return this.imageUtility.getCategoryImageUrl(categoryId);
  }

  getProfileImage(userId: string): string {
    return this.imageUtility.getProfileImageUrl(userId);
  }
}
```

### Method 2: Using the Pipe in Templates

```html
<!-- Basic usage -->
<img [src]="'product' | imageUrl" alt="Product Image">

<!-- With custom photo name -->
<img [src]="'product' | imageUrl:'custom-photo.jpg'" alt="Product Image">

<!-- With object parameter -->
<img [src]="{ controllerName: 'product', photoName: 'photo.jpg' } | imageUrl" alt="Product Image">
```

### Method 3: Using the Image Upload Service

```typescript
import { ImageUploadService } from '../Services/image-upload.service';

export class MyComponent {
  constructor(private imageUpload: ImageUploadService) {}

  getImageUrl(): string {
    return this.imageUpload.constructImageUrl('product', 'photo');
  }
}
```

## 📋 **Supported Controller Names**

| Controller | URL Pattern | Usage |
|------------|-------------|-------|
| `product` | `/assets/product/photo` | Product images |
| `category` | `/assets/category/photo` | Category images |
| `subcategory` | `/assets/subcategory/photo` | Subcategory images |
| `profile` | `/assets/profile/photo` | User profile images |
| `brand` | `/assets/brand/photo` | Brand logos |
| `custom` | `/assets/{custom}/photo` | Any custom controller |

## 🔧 **Implementation Examples**

### Example 1: Product Component

```typescript
// product-item.component.ts
export class ProductItemComponent {
  constructor(private imageUtility: ImageUtilityService) {}

  getProductImageUrl(): string {
    if (this.product.imageUrl && this.imageUtility.isValidImageUrl(this.product.imageUrl)) {
      return this.product.imageUrl;
    }
    return this.imageUtility.getProductImageUrl(this.product.id);
  }
}
```

```html
<!-- product-item.component.html -->
<img [src]="getProductImageUrl()" [alt]="product.name">
```

### Example 2: Category Component

```typescript
// category.component.ts
export class CategoryComponent {
  constructor(private imageUtility: ImageUtilityService) {}

  getCategoryImageUrl(categoryId: string): string {
    return this.imageUtility.getCategoryImageUrl(categoryId);
  }
}
```

```html
<!-- category.component.html -->
<img [src]="getCategoryImageUrl(category.id)" [alt]="category.name">
```

### Example 3: Profile Component

```typescript
// profile.component.ts
export class ProfileComponent {
  constructor(private imageUtility: ImageUtilityService) {}

  getProfileImageUrl(): string {
    const userId = localStorage.getItem('customerId') || 
                   localStorage.getItem('techCompanyId') || 
                   localStorage.getItem('deliveryPersonId') || 
                   localStorage.getItem('adminId');
    return this.imageUtility.getProfileImageUrl(userId || 'default');
  }
}
```

```html
<!-- profile.component.html -->
<img [src]="getProfileImageUrl()" [alt]="User Profile">
```

## 🛡️ **Error Handling**

### Fallback Images

The system automatically provides fallback images when the main image fails to load:

```typescript
onImgError(event: Event) {
  const fallbackUrl = this.imageUtility.getImageUrl('placeholder', 'default.jpg');
  (event.target as HTMLImageElement).src = fallbackUrl;
}
```

### URL Validation

```typescript
// Check if URL follows the correct pattern
if (this.imageUtility.isValidImageUrl(imageUrl)) {
  // URL is valid
} else {
  // URL needs to be constructed
  const correctUrl = this.imageUtility.getImageUrl('product', 'photo');
}
```

## 🔄 **Migration Guide**

### Before (Old Way)
```html
<img [src]="product.imageUrl || 'https://picsum.photos/seed/' + product.id + '/300/200'">
```

### After (New Way)
```html
<img [src]="getProductImageUrl()">
```

### Or Using Pipe
```html
<img [src]="'product' | imageUrl">
```

## 🧪 **Testing**

### Test URL Construction
```typescript
// Should return: https://localhost:7230/assets/product/photo
const url = this.imageUtility.getProductImageUrl('123');

// Should return: https://localhost:7230/assets/category/custom.jpg
const url = this.imageUtility.getCategoryImageUrl('456', 'custom.jpg');
```

### Test URL Validation
```typescript
// Should return true
const isValid = this.imageUtility.isValidImageUrl('https://localhost:7230/assets/product/photo');

// Should return false
const isValid = this.imageUtility.isValidImageUrl('https://picsum.photos/300/200');
```

## 📝 **Best Practices**

1. **Always use the service methods** instead of hardcoding URLs
2. **Provide fallback images** for error handling
3. **Validate URLs** before using them
4. **Use the pipe in templates** for simple cases
5. **Use the service in components** for complex logic
6. **Keep controller names consistent** across the application

## 🔗 **Related Files**

- `src/app/Services/image-utility.service.ts` - Core utility service
- `src/app/Pipes/image-url.pipe.ts` - Template pipe
- `src/app/Services/image-upload.service.ts` - Upload service (updated)
- `src/app/components/products/components/product-item/` - Example implementation

## 🎉 **Benefits**

1. **Consistency**: All images follow the same URL pattern
2. **Maintainability**: Centralized URL construction logic
3. **Flexibility**: Easy to change base URLs or patterns
4. **Type Safety**: TypeScript support for all methods
5. **Error Handling**: Built-in validation and fallbacks
6. **Performance**: Efficient URL construction and caching 