import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaintenanceService } from '../../../../../Services/maintenance.service';
import { AuthService } from '../../../../../Services/auth.service';
import { Maintenance } from '../../../../../Interfaces/imaintenance';
import { GeneralResponse } from '../../../../../Interfaces/iorder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './components/create/create.component';
import { log } from 'util';

@Component({
  selector: 'app-customer-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-maintenance.component.html',
  styleUrls: ['./customer-maintenance.component.css']
})
export class CustomerMaintenanceComponent implements OnInit {
  maintenances: Maintenance[] = [];
  loading = false;

  constructor(
    private maintenanceService: MaintenanceService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.maintenanceService.getAll().subscribe({
      next: (res) => {
        console.log(res);
        
        if (res.success) this.maintenances = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        
        this.loading = false
      }
    });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result) => {
      if (result === 'created') {
        this.loadRequests(); // refresh list after creation
      }
    }).catch(() => {});
  }
}
