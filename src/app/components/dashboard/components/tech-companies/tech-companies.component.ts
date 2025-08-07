import { Component } from '@angular/core';
import { TechCompany, TechCompany2, TechCompanyService } from '../../../../Services/tech-company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-companies.component.html',
  styleUrl: './tech-companies.component.css'
})
export class TechCompaniesComponent {
  techCompanies: TechCompany2[] = [];
  loading = false;
  error = '';
  selectedCompany: any = null;

  constructor(private techCompanyService: TechCompanyService) {}

  ngOnInit(): void {
    this.loading = true;

    this.techCompanyService.getAllTechCompanies().subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.techCompanies = res.data;
        } else {
          this.error = res.message || 'Failed to load tech companies.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.error = 'Error loading tech companies.';
        this.loading = false;
      }
    });
  }

  openDetails(company: any) {
  this.selectedCompany = company;
}

closeDetails() {
  this.selectedCompany = null;
}
}
