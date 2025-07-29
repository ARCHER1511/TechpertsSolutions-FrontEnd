import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService, Customer } from '../../../../Services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = '';

    console.log('Loading customers...');

    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        console.log('Customers response:', response);
        if (response.success) {
          this.customers = response.data;
          console.log('Loaded customers:', this.customers.length);
        } else {
          this.error = response.message || 'Failed to load customers';
          console.error('Failed to load customers:', response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error = 'Failed to load customers. Please try again later.';
        this.loading = false;
        
        // For development/testing, add some mock data
        if (err.status === 0 || err.status === 404) {
          console.log('Adding mock customers for development');
          this.customers = [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              address: '123 Main St, City',
              active: true,
              registrationDate: '2024-01-15',
              lastLoginDate: '2024-01-20'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+1234567891',
              address: '456 Oak Ave, Town',
              active: true,
              registrationDate: '2024-01-10',
              lastLoginDate: '2024-01-19'
            }
          ];
          this.error = '';
        }
      }
    });
  }
}
