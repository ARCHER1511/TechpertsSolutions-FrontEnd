import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TechCompany2,
  TechCompanyService
} from '../../../../Services/tech-company.service';

@Component({
  selector: 'app-tech-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tech-companies.component.html',
  styleUrl: './tech-companies.component.css'
})
export class TechCompaniesComponent implements OnInit {
  techCompanies: TechCompany2[] = [];
  loading = false;
  error = '';
  selectedCompany: TechCompany2 | null = null;
  editingCompany: TechCompany2 | null = null;

  editData = {
    userName: '',
    email: '',
    city: '',
    country: '',
    mapLocation: '',
    fullName: '',
    phoneNumber: '',
    address: ''
  };

  @ViewChild('detailsModal') detailsModalRef!: ElementRef;
  private bootstrapModal: any;

  constructor(private techCompanyService: TechCompanyService) {}

  ngOnInit(): void {
    this.loadTechCompanies();
  }

  loadTechCompanies(): void {
    this.loading = true;
    this.error = '';

    this.techCompanyService.getAllTechCompanies().subscribe({
      next: (res) => {
        if (res.success) {
          this.techCompanies = res.data;
        } else {
          this.error = res.message || 'Failed to load tech companies.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tech companies:', err);
        this.error = 'Failed to load tech companies.';
        this.loading = false;

        if (err.status === 0 || err.status === 404) {
          this.techCompanies = [];
          this.error = '';
        }
      }
    });
  }

  showDetails(company: TechCompany2): void {
    this.selectedCompany = company;

    const bootstrap = (window as any).bootstrap;
    if (bootstrap && this.detailsModalRef?.nativeElement) {
      this.bootstrapModal = new bootstrap.Modal(this.detailsModalRef.nativeElement);
      this.bootstrapModal.show();
    }
  }

  closeDetails(): void {
    this.selectedCompany = null;
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
  }

  startEdit(company: TechCompany2): void {
    this.editingCompany = company;
    this.editData = {
      userName: company.userName || '',
      email: '',
      city: company.city || '',
      country: company.country || '',
      mapLocation: company.mapLocation || '',
      fullName: '',
      phoneNumber: '',
      address: ''
    };
  }

  cancelEdit(): void {
    this.editingCompany = null;
  }

  submitEdit(): void {
    if (!this.editingCompany) return;
    const id = this.editingCompany.id;

    this.techCompanyService.updateTechCompany(id, this.editData).subscribe({
      next: (res) => {
        if (res.success) {
          const index = this.techCompanies.findIndex(c => c.id === id);
          if (index !== -1) {
            this.techCompanies[index] = {
              ...this.techCompanies[index],
              ...this.editData
            };
          }
          this.cancelEdit();
        } else {
          alert('Failed to update: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Update error', err);
        alert('Update failed. Check console for details.');
      }
    });
  }
}
