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
    selected: boolean;
    selectedProduct: IProduct | null;
  }[] = [
    {
      name: 'Processor',
      selected: true,
      selectedProduct: null
    },
    { name: 'Motherboard', selected: false, selectedProduct: null },
    { name: 'CPU Cooler', selected: false, selectedProduct: null },
    { name: 'Case', selected: false, selectedProduct: null },
    { name: 'Graphics Card', selected: false, selectedProduct: null },
    { name: 'RAM', selected: false, selectedProduct: null },
    { name: 'Storage', selected: false, selectedProduct: null },
    { name: 'Case Cooler', selected: false, selectedProduct: null },
    { name: 'Power Supply', selected: false, selectedProduct: null },
    { name: 'Monitor', selected: false, selectedProduct: null },
    { name: 'Accessories', selected: false, selectedProduct: null }
  ];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras.state?.['selectedProduct'];

    if (product && product.category) {
      this.setSelectedProduct(product.category, product);
    }
  }

  navigateToCategory(name: string) {
    this.router.navigate(['/category-details', name]);
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
    const item = this.components.find(c => c.name === category);
    if (item) {
      item.selected = true;
      item.selectedProduct = product;
    }
  }
}
