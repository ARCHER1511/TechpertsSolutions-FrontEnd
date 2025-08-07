import { Component } from '@angular/core';
import { DeliveryPerson, DeliveryPersonService } from '../../../../Services/delivery-person.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent {
  deliveryPersons: DeliveryPerson[] = [];
  selectedPerson: DeliveryPerson | null = null;
  showModal = false;

  constructor(private deliveryService: DeliveryPersonService) {}

  ngOnInit(): void {
    this.deliveryService.getAllDeliveryPersons().subscribe({
      next: (res) => {
      console.log(res);
      if (res.success) {
        this.deliveryPersons = res.data;
      }
    },
    error: (err) => {
      console.log(err);
    }
    });
  }

  openDetails(person: DeliveryPerson): void {
    this.selectedPerson = person;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPerson = null;
  }
}
