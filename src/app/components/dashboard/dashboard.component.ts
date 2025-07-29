import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';

interface DashboardStats {
  totalCustomers: number;
  pendingProducts: number;
  totalOrders: number;
  revenue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DatePipe, CurrencyPipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isDarkMode = false;
  currentDate = new Date();
  stats: DashboardStats = {
    totalCustomers: 1250,
    pendingProducts: 23,
    totalOrders: 847,
    revenue: 125000
  };

  ngOnInit() {
    // Check if dark mode is already set
    this.isDarkMode = document.body.classList.contains('dark-mode');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
