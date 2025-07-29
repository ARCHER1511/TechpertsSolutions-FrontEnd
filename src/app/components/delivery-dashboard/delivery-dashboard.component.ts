import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveryService } from '../../Services/delivery.service';
import { OrderService } from '../../Services/order.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent implements OnInit {
  deliveries: any[] = [];
  orders: any[] = [];
  loading = false;
  error = '';
  stats = {
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  };

  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryData();
  }

  loadDeliveryData(): void {
    this.loading = true;
    this.error = '';

    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      console.log('Loading delivery data for ID:', deliveryPersonId);
      // Load deliveries for this delivery person
      this.deliveryService.getDeliveriesByDeliveryPerson(deliveryPersonId).subscribe({
        next: (response) => {
          if (response.success) {
            this.deliveries = response.data;
            this.updateDeliveryStats();
          } else {
            this.error = response.message || 'Failed to load deliveries';
            console.error('Failed to load deliveries:', response.message);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading deliveries:', err);
          this.error = 'Failed to load deliveries';
          this.loading = false;
          
          // For development/testing, add mock data
          if (err.status === 0 || err.status === 404) {
            console.log('Adding mock delivery data for development');
            this.deliveries = [
              {
                id: '1',
                orderId: 'ORD001',
                customerName: 'John Doe',
                address: '123 Main St, City',
                status: 'Pending',
                createdAt: '2024-01-20'
              },
              {
                id: '2',
                orderId: 'ORD002',
                customerName: 'Jane Smith',
                address: '456 Oak Ave, Town',
                status: 'InProgress',
                createdAt: '2024-01-19'
              }
            ];
            this.error = '';
            this.updateDeliveryStats();
          }
        }
      });

      // Load orders that need delivery
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          if (response.success) {
            // Filter orders that are ready for delivery
            this.orders = response.data.filter((order: any) => 
              order.status === 'Shipped' || order.status === 'ReadyForDelivery'
            );
            this.updateOrderStats();
          }
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          
          // For development/testing, add mock orders
          if (err.status === 0 || err.status === 404) {
            console.log('Adding mock orders for development');
            this.orders = [
              {
                id: '1',
                customerName: 'Alice Johnson',
                address: '789 Pine Rd, Village',
                status: 'ReadyForDelivery',
                total: 299.99
              },
              {
                id: '2',
                customerName: 'Bob Wilson',
                address: '321 Elm St, Borough',
                status: 'Shipped',
                total: 199.99
              }
            ];
            this.updateOrderStats();
          }
        }
      });
    } else {
      this.error = 'Delivery person ID not found. Please log in again.';
      this.loading = false;
      console.error('Delivery person ID not found in localStorage. Available keys:', Object.keys(localStorage));
    }
  }

  private updateDeliveryStats(): void {
    this.stats.totalDeliveries = this.deliveries.length;
    this.stats.pendingDeliveries = this.deliveries.filter(delivery => delivery.status === 'Pending').length;
    this.stats.completedDeliveries = this.deliveries.filter(delivery => delivery.status === 'Completed').length;
  }

  private updateOrderStats(): void {
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter(order => order.status === 'ReadyForDelivery').length;
    this.stats.completedOrders = this.orders.filter(order => order.status === 'Delivered').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'InProgress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'InProgress': return 'bi-truck';
      case 'Completed': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  acceptDelivery(deliveryId: string): void {
    this.deliveryService.updateDelivery(deliveryId, { status: 'InProgress' }).subscribe({
      next: () => {
        this.loadDeliveryData();
      },
      error: (err) => {
        console.error('Error accepting delivery:', err);
        this.error = 'Failed to accept delivery';
      }
    });
  }

  completeDelivery(deliveryId: string): void {
    this.deliveryService.updateDelivery(deliveryId, { status: 'Completed' }).subscribe({
      next: () => {
        this.loadDeliveryData();
      },
      error: (err) => {
        console.error('Error completing delivery:', err);
        this.error = 'Failed to complete delivery';
      }
    });
  }
} 