import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { IProduct } from '../../../Interfaces/iproduct';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [NgClass,NgIf],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css'
})
export class SelectorComponent {
  components: {
    name: string;
    id: string;
    selected: boolean;
    selectedProduct: IProduct | null;
  }[] = [
    {
      name: 'Processor',
      id: 'cpu',
      selected: true,
      selectedProduct: null
    },
    { name: 'Motherboard', id: 'motherboard', selected: false, selectedProduct: null },
    { name: 'CPU Cooler', id: 'cpu-cooler', selected: false, selectedProduct: null },
    { name: 'Case', id: 'case', selected: false, selectedProduct: null },
    { name: 'Graphics Card', id: 'gpu', selected: false, selectedProduct: null },
    { name: 'RAM', id: 'ram', selected: false, selectedProduct: null },
    { name: 'Storage', id: 'storage', selected: false, selectedProduct: null },
    { name: 'Case Cooler', id: 'case-cooler', selected: false, selectedProduct: null },
    { name: 'Power Supply', id: 'power-supply', selected: false, selectedProduct: null },
    { name: 'Monitor', id: 'monitor', selected: false, selectedProduct: null },
    { name: 'Accessories', id: 'accessories', selected: false, selectedProduct: null }
  ];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras.state?.['selectedProduct'];

    if (product && product.category) {
      this.setSelectedProduct(product.category, product);
    }
  }

  navigateToCategory(componentId: string) {
    this.router.navigate(['/category-details', componentId]);
  }

  chooseAnother(name: string) {
    const item = this.components.find(c => c.name === name);
    if (item) {
      item.selected = false;
      item.selectedProduct = null;
    }
  }

  removeComponent(name: string) {
    this.chooseAnother(name);
  }

  setSelectedProduct(category: string, product: IProduct) {
    // Map category names to component names for better matching
    const categoryMap: { [key: string]: string } = {
      'Processors': 'Processor',
      'Graphics Cards': 'Graphics Card',
      'Motherboards': 'Motherboard',
      'CPU Cooler': 'CPU Cooler',
      'Case': 'Case',
      'RAM': 'RAM',
      'Storage': 'Storage',
      'Case Cooler': 'Case Cooler',
      'Power Supply': 'Power Supply',
      'Monitor': 'Monitor',
      'Accessories': 'Accessories',
      'Expensions & Networking': 'Accessories' // Map to accessories for now
    };

    const componentName = categoryMap[category] || category;
    const item = this.components.find(c => c.name === componentName);
    if (item) {
      item.selected = true;
      item.selectedProduct = product;
      console.log(`✅ Selected ${product.name} for ${componentName}`);
    } else {
      console.warn(`⚠️ Could not find component for category: ${category}`);
    }
  }
}
