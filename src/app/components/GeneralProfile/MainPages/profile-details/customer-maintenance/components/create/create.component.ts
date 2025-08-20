import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceCreateDTO } from '../../../../../../../Interfaces/imaintenance';
import { MaintenanceStatus } from '../../../../../../../Interfaces/imaintenance';
import { MaintenanceService } from '../../../../../../../Services/maintenance.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  model: MaintenanceCreateDTO = {
    customerId: '48755882-78e0-48f9-92b7-3649de299456',
    techCompanyId: '088ba8b0-05ab-45ab-a6c8-ff98b94ca22a',  // fixed value
    warrantyId: 'bb1ae551-73e9-4345-bcc3-d2873d57dc67',     // fixed value
    notes: '',
    status: MaintenanceStatus.Requested,
    deviceType: '',
    issue: '',
    priority: '',
    deviceImages: [
      "sring"
    ]
  };

  loading = false;
  error: string | null = null;

  constructor(
    private maintenanceService: MaintenanceService,
    public activeModal: NgbActiveModal
  ) {
//     if (typeof window !== 'undefined') {
//   const storedCustomerId = localStorage.getItem('customerId');
//   if (storedCustomerId) {
//     this.model.customerId = storedCustomerId; // only assign if exists
//   } else {
//     console.error('Customer ID is missing in localStorage!');
//   }
// }

  }

  submit(): void {
    this.loading = true;
    this.maintenanceService.create(this.model).subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        if (res.success) {
          this.activeModal.close('created');
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.error = 'Something went wrong. Please try again.';
      }
    });
  }
}
