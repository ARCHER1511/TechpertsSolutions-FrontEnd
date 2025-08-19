import { Component } from '@angular/core';
import { Maintenance } from '../../../../Interfaces/imaintenance';
import { MaintenanceService } from '../../../../Services/maintenance.service';
import { GeneralResponse } from '../../../../Interfaces/iorder';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maintenance-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './maintenance-requests.component.html',
  styleUrl: './maintenance-requests.component.css'
})
export class MaintenanceRequestsComponent {
  maintenances: Maintenance[] = [];
  loading = false;
  error: string | null = null;

  constructor(private maintenanceService: MaintenanceService, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchMaintenances();
  }

  fetchMaintenances(): void {
    this.loading = true;
    this.error = null;

    this.maintenanceService.getAll().subscribe({
      next: (res: GeneralResponse<Maintenance[]>) => {
        console.log(res);
        this.maintenances = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.error = 'Failed to load maintenance requests.';
        this.loading = false;
      }
    });
  }

  accept(maintenanceId: string): void {
    // you may want to pass the logged-in techCompanyId, for now I’ll use a placeholder
    const techCompanyId = 'YOUR_TECH_COMPANY_ID';

    this.maintenanceService.acceptRequest(maintenanceId, techCompanyId).subscribe({
      next: (res: GeneralResponse<Maintenance>) => {
        console.log('Accepted:', res);
        this.toaster.success(res.message)
        // Option 1: Refresh the list
        this.fetchMaintenances();

        // Option 2: Update in place
        // const index = this.maintenances.findIndex(m => m.id === maintenanceId);
        // if (index !== -1 && res.data) {
        //   this.maintenances[index] = res.data;
        // }
      },
      error: (err) => {
        this.toaster.error(err.message)
        console.error('Accept failed:', err);
        this.error = 'Failed to accept maintenance request.';
      }
    });
  }
}
