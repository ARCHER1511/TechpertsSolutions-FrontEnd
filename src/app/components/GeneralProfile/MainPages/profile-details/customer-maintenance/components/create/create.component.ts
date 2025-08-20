import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService } from '../../../../../../../Services/maintenance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceCreateDTO, MaintenanceStatus } from '../../../../../../../Interfaces/imaintenance';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  model: MaintenanceCreateDTO = {
  customerId: '',
  techCompanyId: '',
  warrantyId: '',
  notes: '',
  status: MaintenanceStatus.Requested
};


  loading = false;
  error: string | null = null;

  constructor(
    private maintenanceService: MaintenanceService,
    public activeModal: NgbActiveModal
  ) {}

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
