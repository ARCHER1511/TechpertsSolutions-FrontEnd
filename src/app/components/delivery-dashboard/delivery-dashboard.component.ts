import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelveryPersonService } from '../../Services/delvery-person.service';
import { Offer } from '../../Interfaces/idelvery-person';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from "@angular/router";

interface DashboardStats {
  totalCustomers: number;
  pendingProducts: number;
  totalOrders: number;
  revenue: number;
}

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent implements OnInit {
  isDarkMode = false;
  currentDate = new Date();

  stats: DashboardStats = {
    totalCustomers: 1250,
    pendingProducts: 23,
    totalOrders: 847,
    revenue: 125000
  };

  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('dark-mode');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}


