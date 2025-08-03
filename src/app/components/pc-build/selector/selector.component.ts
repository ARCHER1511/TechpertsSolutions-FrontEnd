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
      id: 'Processor',
      selected: true,
      selectedProduct: null
    },
    { name: 'Motherboard', id: 'Motherboard', selected: false, selectedProduct: null },
    { name: 'CPU Cooler', id: 'CPUCooler', selected: false, selectedProduct: null },
    { name: 'Case', id: 'Case', selected: false, selectedProduct: null },
    { name: 'Graphics Card', id: 'GraphicsCard', selected: false, selectedProduct: null },
    { name: 'RAM', id: 'RAM', selected: false, selectedProduct: null },
    { name: 'Storage', id: 'Storage', selected: false, selectedProduct: null },
    { name: 'Case Cooler', id: 'CaseCooler', selected: false, selectedProduct: null },
    { name: 'Power Supply', id: 'PowerSupply', selected: false, selectedProduct: null },
    { name: 'Monitor', id: 'Monitor', selected: false, selectedProduct: null },
    { name: 'Accessories', id: 'Accessories', selected: false, selectedProduct: null }
  ];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras.state?.['selectedProduct'];

    if (product && product.category) {
      this.setSelectedProduct(product.category, product);
    }
  }

  navigateToCategory(componentId: string) {
    this.router.navigate(['/selector-category-details', componentId]);
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
