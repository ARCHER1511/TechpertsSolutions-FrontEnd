import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Environment } from '../Environment/environment';
import { IGeneralResponse, ICategoryWithProducts } from '../Interfaces/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${Environment.baseUrl}/Category`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<IGeneralResponse<ICategoryWithProducts[]>> {
    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<IGeneralResponse<ICategoryWithProducts[]>>(`${this.apiUrl}/All`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        
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
          message: 'Failed to load categories due to SSL certificate issue',
          data: []
        });
      })
    );
  }
}
