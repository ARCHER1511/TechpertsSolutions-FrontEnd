import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CategoryService } from '../../Services/category.service';
import { ICategory } from '../../Interfaces/icategory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
categories = [
  { id: 'services', name: 'SERVICES', imageUrl: 'assets/Images/Categories/customer-service-1.png' },
  { id: 'cpu', name: 'Processors', imageUrl: 'assets/Images/Categories/processors.png' },
  { id: 'motherboard', name: 'Motherboards', imageUrl: 'assets/Images/Categories/motherboard.png' },
  { id: 'gpu', name: 'Graphics Cards', imageUrl: 'assets/Images/video-card-1.png' },
  { id: 'laptop', name: 'Laptop', imageUrl: 'assets/Images/Categories/laptop.png' },
  { id: 'ram', name: 'RAM', imageUrl: 'assets/Images/Categories/ram.png' },
];

  constructor(private router: Router) {}
navigateToCategory(id: string) {
    this.router.navigate(['/category-details', id]);
  }

  trackById(index: number, item: ICategory) {
    return item.id;
  }
}
