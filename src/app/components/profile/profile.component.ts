import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CustomerService } from '../../Services/customer.service';
import { TechCompanyService } from '../../Services/tech-company.service';
import { DeliveryPersonService } from '../../Services/delivery-person.service';
import { AdminService } from '../../Services/admin.service';
import { RolesService } from '../../Services/roles.service';
import { OrderService } from '../../Services/order.service';
import { WishlistService } from '../../Services/wishlist.service';
import { MaintenanceService } from '../../Services/maintenance.service';
import { DeliveryService } from '../../Services/delivery.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  userRoles: string[] = [];
  roleSpecificData: any = {};
  quickStats: any = {
    totalOrders: 0,
    totalWishlist: 0,
    maintenanceRequests: 0,
    deliveries: 0,
    pendingProducts: 0
  };
  loading = false;
  error = '';

  // Add localStorage property for template access
  localStorage = localStorage;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private techCompanyService: TechCompanyService,
    private deliveryPersonService: DeliveryPersonService,
    private adminService: AdminService,
    private rolesService: RolesService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private maintenanceService: MaintenanceService,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    
    // For testing purposes - if no roles are detected, set default roles
    if (this.userRoles.length === 0) {
      console.log('No roles detected, setting default roles for testing');
      this.setDefaultRoles();
    }
  }

  private setDefaultRoles(): void {
    // For testing - set all four roles
    this.userRoles = ['Admin', 'TechCompany', 'Customer', 'DeliveryPerson'];
    localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
    console.log('Default roles set:', this.userRoles);
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = '';

    // Get user roles from localStorage
    const userRoles = localStorage.getItem('userRoles');
    if (userRoles) {
      this.userRoles = JSON.parse(userRoles);
    }

    console.log('Profile loading - User roles:', this.userRoles);
    console.log('Profile loading - localStorage data:', {
      userId: localStorage.getItem('userId'),
      customerId: localStorage.getItem('customerId'),
      userName: localStorage.getItem('userName'),
      userEmail: localStorage.getItem('userEmail'),
      userToken: localStorage.getItem('userToken') ? 'Present' : 'Missing'
    });

    // Get user data - try multiple sources
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');
    const userName = localStorage.getItem('userName');

    if (userId || customerId || userName) {
      this.loadUserDataByRole(userId || customerId);
    } else {
      this.error = 'User not authenticated';
      this.loading = false;
    }
  }

  private loadUserDataByRole(userId: string | null): void {
    if (!userId) {
      // If no user ID, try to load basic user data from localStorage
      this.loadBasicUserData();
      return;
    }

    // Try to load customer data first
    this.customerService.getCustomerById(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.userData = response.data;
        } else {
          // If customer data fails, try to load basic user data
          this.loadBasicUserData();
        }
        
        // Load additional data based on roles regardless of customer data success
        this.loadRoleSpecificData();
        this.loadQuickStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customer data:', err);
        // If customer data fails, try to load basic user data
        this.loadBasicUserData();
        this.loadRoleSpecificData();
        this.loadQuickStats();
        this.loading = false;
      }
    });
  }

  private loadBasicUserData(): void {
    // Load basic user data from localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    this.userData = {
      name: userName || 'User',
      userName: userName || 'user',
      email: userEmail || 'user@example.com',
      phone: 'Not provided',
      address: 'Not provided',
      registrationDate: new Date().toISOString(),
      isActive: true
    };
  }

  private loadRoleSpecificData(): void {
    // Load data based on user roles
    if (this.hasRole('TechCompany')) {
      this.loadTechCompanyData();
    }
    if (this.hasRole('DeliveryPerson')) {
      this.loadDeliveryPersonData();
    }
    if (this.hasRole('Admin')) {
      this.loadAdminData();
    }
  }

  private loadTechCompanyData(): void {
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      console.log('Loading tech company data for ID:', techCompanyId);
      this.techCompanyService.getTechCompanyById(techCompanyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.roleSpecificData.techCompany = response.data;
          }
        },
        error: (err) => {
          console.error('Error loading tech company data:', err);
        }
      });
    } else {
      console.error('Tech company ID not found in localStorage');
    }
  }

  private loadDeliveryPersonData(): void {
    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      console.log('Loading delivery person data for ID:', deliveryPersonId);
      this.deliveryPersonService.getDeliveryPersonById(deliveryPersonId).subscribe({
        next: (response) => {
          if (response.success) {
            this.roleSpecificData.deliveryPerson = response.data;
          }
        },
        error: (err) => {
          console.error('Error loading delivery person data:', err);
        }
      });
    } else {
      console.error('Delivery person ID not found in localStorage');
    }
  }

  private loadAdminData(): void {
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      console.log('Loading admin data for ID:', adminId);
      this.adminService.getAdminById(adminId).subscribe({
        next: (response) => {
          if (response.success) {
            this.roleSpecificData.admin = response.data;
          }
        },
        error: (err) => {
          console.error('Error loading admin data:', err);
        }
      });
    } else {
      console.error('Admin ID not found in localStorage');
    }
  }

  private loadQuickStats(): void {
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');
    const currentUserId = userId || customerId;
    
    if (!currentUserId) {
      console.log('No user ID found for loading stats');
      return;
    }

    // Load customer orders only if user has customer role
    if (this.isCustomer()) {
      this.orderService.getOrdersByCustomer(currentUserId).subscribe({
        next: (response) => {
          if (response.success) {
            this.quickStats.totalOrders = response.data.length;
            this.quickStats.activeOrders = response.data.filter((order: any) => 
              order.status !== 'Delivered' && order.status !== 'Cancelled'
            ).length;
          }
        },
        error: (err) => {
          console.error('Error loading orders:', err);
        }
      });

      // Load wishlist items only if user has customer role
      this.wishlistService.getWishListByCustomerId(currentUserId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.quickStats.wishlistItems = response.data.items?.length || 0;
          }
        },
        error: (err: any) => {
          console.error('Error loading wishlist:', err);
        }
      });
    }

    // Load role-specific stats
    this.loadRoleSpecificStats();
  }

  private loadRoleSpecificStats(): void {
    this.userRoles.forEach(role => {
      switch (role) {
        case 'TechCompany':
          this.loadTechCompanyStats();
          break;
        case 'DeliveryPerson':
          this.loadDeliveryPersonStats();
          break;
        case 'Admin':
          this.loadAdminStats();
          break;
      }
    });
  }

  private loadTechCompanyStats(): void {
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      // Load maintenance requests
      this.maintenanceService.getMaintenanceByTechCompany(techCompanyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.quickStats.maintenanceRequests = response.data.length;
          }
        },
        error: (err) => {
          console.error('Error loading tech company stats:', err);
        }
      });
    }
  }

  private loadDeliveryPersonStats(): void {
    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      // Load deliveries
      this.deliveryService.getDeliveriesByDeliveryPerson(deliveryPersonId).subscribe({
        next: (response) => {
          if (response.success) {
            this.quickStats.deliveries = response.data.length;
          }
        },
        error: (err) => {
          console.error('Error loading delivery person stats:', err);
        }
      });
    }
  }

  private loadAdminStats(): void {
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      // Load admin stats
      this.adminService.getDashboardStats().subscribe({
        next: (response) => {
          if (response.success) {
            this.quickStats.pendingProducts = response.data.pendingProducts || 0;
            this.quickStats.totalOrders = response.data.totalOrders || 0;
          }
        },
        error: (err) => {
          console.error('Error loading admin stats:', err);
        }
      });
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isTechCompany(): boolean {
    return this.hasRole('TechCompany');
  }

  isCustomer(): boolean {
    return this.hasRole('Customer');
  }

  isDeliveryPerson(): boolean {
    return this.hasRole('DeliveryPerson');
  }

  getDashboardRoute(): string {
    if (this.isAdmin()) {
      return '/dashboard';
    } else if (this.isTechCompany()) {
      return '/tech-company/dashboard';
    } else if (this.isDeliveryPerson()) {
      return '/delivery/dashboard';
    } else {
      return '/customer/orders';
    }
  }

  getPrimaryRole(): string {
    // Return the primary role for display purposes
    if (this.isAdmin()) return 'Admin';
    if (this.isTechCompany()) return 'TechCompany';
    if (this.isDeliveryPerson()) return 'DeliveryPerson';
    if (this.isCustomer()) return 'Customer';
    return 'User';
  }

  // Helper methods for template access
  getUserId(): string {
    return localStorage.getItem('userId') || 'Not found';
  }

  getCustomerId(): string {
    return localStorage.getItem('customerId') || 'Not found';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'Not found';
  }
} 