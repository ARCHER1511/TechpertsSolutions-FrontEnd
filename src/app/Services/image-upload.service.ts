import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface ImageUploadRequest {
  file: File;
  controllerName: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: {
    imageUrl: string;
    fileName: string;
  };
}

export interface ImageValidationResponse {
  success: boolean;
  message: string;
  data?: {
    isValid: boolean;
    errors?: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = `${Environment.baseUrl}/ImageUpload`;

  constructor(private http: HttpClient) {}

  // Upload image
  uploadImage(file: File, controllerName: string): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageUploadResponse>(`${this.apiUrl}/upload/${controllerName}`, formData);
  }

  // Delete image
  deleteImage(imageUrl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { 
      body: { imageUrl } 
    });
  }

  // Validate image
  validateImage(file: File): Observable<ImageValidationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageValidationResponse>(`${this.apiUrl}/validate`, formData);
  }

  // Upload product image
  uploadProductImage(file: File, productId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'product');
  }

  // Upload category image
  uploadCategoryImage(file: File, categoryId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'category');
  }

  // Upload subcategory image
  uploadSubCategoryImage(file: File, subCategoryId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'subcategory');
  }

  // Delete product image
  deleteProductImage(productId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/Product/${productId}/delete-image`);
  }

  // Delete category image
  deleteCategoryImage(categoryId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/Category/${categoryId}/delete-image`);
  }

  // Delete subcategory image
  deleteSubCategoryImage(subCategoryId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/SubCategory/${subCategoryId}/delete-image`);
  }
} 