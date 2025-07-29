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

    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
        } else {
          this.error = response.message || 'Failed to load customers';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error = 'Failed to load customers. Please try again later.';
        this.loading = false;
      }
    });
  }
}
