import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService, UpdateClusterStatusRequest } from '../../../../Services/delivery.service';
import { DeliveryClusterStatus } from '../../../../Services/delivery.service';

@Component({
  selector: 'app-assigend-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigend-deliveries.component.html',
  styleUrls: ['./assigend-deliveries.component.css']
})
export class AssigendDeliveriesComponent {
  loading = false;
  error: string | null = null;
  offer: any[] = [];
  driverId: string | null = localStorage.getItem('deliveryPersonId');

  private delivery = inject(DeliveryService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries() {
    this.loading = true;
    this.delivery.getAllDeliveries().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.offer = res.data.flatMap(delivery =>
            delivery.clusters.map(c => ({
              id: c.id,
              status: c.status,
              createdAt: delivery.createdAt,
              deliveryLatitude: c.dropoffLatitude,
              deliveryLongitude: c.dropoffLongitude,
              expiryTime: c.assignmentTime,
              driverName: c.assignedDriverName,
              companyName: c.techCompanyName,
              selectedStatus: c.status as DeliveryClusterStatus
            }))
          );
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load deliveries';
        console.error(err);
      }
    });
  }

  changeClusterStatus(cluster: any) {
    if (!cluster.selectedStatus) {
      this.toastr.warning('Please select a status');
      return;
    }

    const request: UpdateClusterStatusRequest = {
      status: cluster.selectedStatus,
      assignedDriverId: this.driverId
    };

    this.delivery.updateClusterStatus(cluster.id, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Status updated successfully');
          this.loadDeliveries(); // reload list
        } else {
          this.toastr.error(res.message || 'Failed to update status');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Server error while updating status');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Assigned': return 'bg-primary';
      case 'InProgress': return 'bg-info text-dark';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'Assigned': return 'bi-truck';
      case 'InProgress': return 'bi-arrow-repeat';
      case 'Completed': return 'bi-check-circle';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  getAllStatuses(): DeliveryClusterStatus[] {
    return [
      DeliveryClusterStatus.Pending,
      DeliveryClusterStatus.Assigned,
      DeliveryClusterStatus.InProgress,
      DeliveryClusterStatus.Completed,
      DeliveryClusterStatus.Cancelled
    ];
  }
}
