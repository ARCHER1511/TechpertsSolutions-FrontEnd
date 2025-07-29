import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechCompanyService } from '../../Services/tech-company.service';
import { MaintenanceService } from '../../Services/maintenance.service';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-tech-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tech-company-dashboard.component.html',
  styleUrls: ['./tech-company-dashboard.component.css']
})
export class TechCompanyDashboardComponent implements OnInit {
  techCompanyData: any = null;
  maintenanceRequests: any[] = [];
  products: any[] = [];
  stats = {
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalProducts: 0,
    activeProducts: 0
  };
  loading = false;
  error = '';

  constructor(
    private techCompanyService: TechCompanyService,
    private maintenanceService: MaintenanceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load tech company data
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      console.log('Loading tech company data for ID:', techCompanyId);
      this.techCompanyService.getTechCompanyById(techCompanyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.techCompanyData = response.data;
            this.loadMaintenanceRequests(techCompanyId);
            this.loadProducts(techCompanyId);
          } else {
            this.error = response.message || 'Failed to load tech company data';
            console.error('Failed to load tech company data:', response.message);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading tech company data:', err);
          this.error = 'Failed to load tech company data';
          this.loading = false;
          
          // For development/testing, add mock data
          if (err.status === 0 || err.status === 404) {
            console.log('Adding mock tech company data for development');
            this.techCompanyData = {
              id: techCompanyId,
              name: 'Tech Solutions Inc.',
              specialization: 'Software Development',
              email: 'contact@techsolutions.com',
              phone: '+1234567890',
              address: '123 Tech Street, Innovation City'
            };
            this.error = '';
            this.loadMockData(techCompanyId);
          }
        }
      });
    } else {
      this.error = 'Tech company ID not found. Please log in again.';
      this.loading = false;
      console.error('Tech company ID not found in localStorage. Available keys:', Object.keys(localStorage));
    }
  }

  private loadMaintenanceRequests(techCompanyId: string): void {
    this.maintenanceService.getMaintenanceByTechCompany(techCompanyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.maintenanceRequests = response.data;
          this.updateStats();
        }
      },
      error: (err) => {
        console.error('Error loading maintenance requests:', err);
      }
    });
  }

  private loadProducts(techCompanyId: string): void {
    // Load products for this tech company
    this.productService.getAllProducts(1, 100, 'name', false).subscribe({
      next: (response) => {
        if (response.success) {
          // Filter products by tech company ID
          this.products = response.data.items.filter((product: any) => 
            product.techCompanyId === techCompanyId
          );
          this.updateStats();
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  private updateStats(): void {
    this.stats.totalRequests = this.maintenanceRequests.length;
    this.stats.pendingRequests = this.maintenanceRequests.filter(req => 
      req.status === 'Pending' || req.status === 'Accepted'
    ).length;
    this.stats.completedRequests = this.maintenanceRequests.filter(req => 
      req.status === 'Completed'
    ).length;
    this.stats.totalProducts = this.products.length;
    this.stats.activeProducts = this.products.filter(product => 
      product.status === 'Approved'
    ).length;
  }

  private loadMockData(techCompanyId: string): void {
    // Mock maintenance requests
    this.maintenanceRequests = [
      {
        id: '1',
        customerName: 'John Doe',
        description: 'Software installation needed',
        status: 'Pending',
        priority: 'Medium',
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        description: 'System maintenance required',
        status: 'InProgress',
        priority: 'High',
        createdAt: '2024-01-19'
      }
    ];

    // Mock products
    this.products = [
      {
        id: '1',
        name: 'Software Package A',
        status: 'Approved',
        price: 299.99
      },
      {
        id: '2',
        name: 'Hardware Component B',
        status: 'Pending',
        price: 199.99
      }
    ];

    this.updateStats();
  }

  acceptMaintenanceRequest(requestId: string): void {
    this.maintenanceService.acceptMaintenanceRequest(requestId).subscribe({
      next: () => {
        this.loadDashboardData(); // Reload data
      },
      error: (err) => {
        console.error('Error accepting maintenance request:', err);
      }
    });
  }

  completeMaintenanceRequest(requestId: string): void {
    this.maintenanceService.completeMaintenanceRequest(requestId).subscribe({
      next: () => {
        this.loadDashboardData(); // Reload data
      },
      error: (err) => {
        console.error('Error completing maintenance request:', err);
      }
    });
  }
} 