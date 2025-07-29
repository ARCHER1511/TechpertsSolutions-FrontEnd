import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Environment } from '../Environment/environment';
import { GeneralResponce, IPagedProducts, IProduct, ProductCategory, ProductPendingStatus, ProductCreateDTO, ProductUpdateDTO } from '../Interfaces/iproduct';
import { GeneralResponse } from '../Interfaces/iorder';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = Environment.baseUrl;

  getAllProducts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDesc: boolean,
    searchQuery: string = '',
    categoryId?: string
  ): Observable<{ success: boolean; message: string; data: IPagedProducts }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDesc', sortDesc.toString());

    if (searchQuery.trim()) {
      params = params.set('search', searchQuery.trim());
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this._httpClient.get<{ success: boolean; message: string; data: IPagedProducts }>(
      `${this._baseUrl}/Product/all`,
      { params, headers }
    ).pipe(
      catchError((error) => {
        console.error('Error loading products:', error);
        
        // Handle SSL certificate errors specifically
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error detected. This is expected in development.');
          console.warn('💡 To resolve this, please:');
          console.warn('   1. Visit https://localhost:7230 in your browser and accept the certificate');
          console.warn('   2. Or change environment.ts to use HTTP instead of HTTPS');
          console.warn('   3. Or configure your backend to use proper SSL certificates');
        }
        
        return of({
          success: false,
          message: 'Failed to load products due to SSL certificate issue. Please check backend connection.',
          data: { 
            pageNumber: 1,
            pageSize: pageSize,
            totalItems: 0,
            totalPages: 0,
            items: []
          }
        });
      })
    );
  }

  getProductById(id: string): Observable<GeneralResponce> {
    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this._httpClient.get<GeneralResponce>(`${this._baseUrl}/Product/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error loading product by ID:', error);
        
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error for product details');
        }
        
        // Create a default product for error case
        const defaultProduct: IProduct = {
          id: '',
          name: 'Product not found',
          price: 0,
          discountPrice: 0,
          imageUrl: '',
          categoryName: null,
          subCategoryId: '',
          subCategoryName: '',
          status: 'None'
        };
        
        return of({
          success: false,
          message: 'Failed to load product details due to SSL certificate issue',
          data: defaultProduct
        });
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<{ success: boolean; message: string; data: IProduct[] }> {
    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this._httpClient.get<{ success: boolean; message: string; data: IProduct[] }>(
      `${this._baseUrl}/Product/by-category/${categoryId}`,
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Error loading products by category:', error);
        
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error for category products');
        }
        
        return of({
          success: false,
          message: 'Failed to load category products due to SSL certificate issue',
          data: []
        });
      })
    );
  }

  getProductSpecifications(productId: string): Observable<{ success: boolean; message: string; data: any[] }> {
    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this._httpClient.get<{ success: boolean; message: string; data: any[] }>(
      `${this._baseUrl}/Product/${productId}/specifications`,
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Error fetching product specifications:', error);
        
        // Handle SSL certificate errors specifically
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error detected. This is expected in development.');
          console.warn('💡 To resolve this, please:');
          console.warn('   1. Visit https://localhost:7230 in your browser and accept the certificate');
          console.warn('   2. Or change environment.ts to use HTTP instead of HTTPS');
          console.warn('   3. Or configure your backend to use proper SSL certificates');
        }
        
        return of({
          success: false,
          message: 'Failed to load specifications due to SSL certificate issue',
          data: []
        });
      })
    );
  }
  addProduct(
    dto: ProductCreateDTO,
    category: ProductCategory,
    status: ProductPendingStatus
  ): Observable<GeneralResponse<string>> {
    const params = new HttpParams()
      .set('categorySelect', category) // ← sends value like 'Motherboard'
      .set('statusSelect', status.toString());
  
    return this._httpClient.post<GeneralResponse<string>>(this._baseUrl, dto, { params });
  }
  
  updateProduct(
      id: string,
      dto: ProductUpdateDTO,
      category: ProductCategory,
      status: ProductPendingStatus
    ): Observable<GeneralResponse<string>> {
      const params = new HttpParams()
        .set('categorySelect', category)
        .set('statusSelect', status);
  
      return this._httpClient.put<GeneralResponse<string>>(`${this._baseUrl}/${id}`, dto, { params });
    }
  
  deleteProduct(id: string): Observable<GeneralResponse<string>> {
      return this._httpClient.delete<GeneralResponse<string>>(`${this._baseUrl}/${id}`);
    }
}
