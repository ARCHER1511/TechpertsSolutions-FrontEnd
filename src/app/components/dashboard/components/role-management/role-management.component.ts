import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserRole } from '../../../../Services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  users: UserRole[] = [];
  availableRoles: string[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedUser: UserRole | null = null;
  selectedRole = '';
  actionLoading = false;

  private subscription = new Subscription();

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsersWithRoles();
    this.loadAvailableRoles();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUsersWithRoles(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.subscription.add(
      this.adminService.getAllUsersWithRoles().subscribe({
        next: (response) => {
          if (response.success) {
            this.users = response.data;
          } else {
            this.errorMessage = response.message || 'Failed to load users';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.errorMessage = 'Failed to load users. Please try again.';
          this.loading = false;
        }
      })
    );
  }

  loadAvailableRoles(): void {
    this.subscription.add(
      this.adminService.getAvailableRoles().subscribe({
        next: (response) => {
          if (response.success) {
            this.availableRoles = response.data || [];
          } else {
            // Fallback to default roles if API fails
            this.availableRoles = ['Customer', 'Admin', 'TechCompany', 'DeliveryPerson'];
          }
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          // Fallback to default roles if API fails
          this.availableRoles = ['Customer', 'Admin', 'TechCompany', 'DeliveryPerson'];
        }
      })
    );
  }

  selectUser(user: UserRole): void {
    this.selectedUser = user;
    this.selectedRole = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  assignRole(): void {
    if (!this.selectedUser || !this.selectedRole) {
      this.errorMessage = 'Please select both a user and a role.';
      return;
    }

    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.subscription.add(
      this.adminService.assignRoleToUser(this.selectedUser.userId, this.selectedRole).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = `Role "${this.selectedRole}" assigned successfully to ${this.selectedUser?.userName}.`;
            this.loadUsersWithRoles(); // Refresh the list
            this.selectedRole = '';
          } else {
            this.errorMessage = response.message || 'Failed to assign role.';
          }
          this.actionLoading = false;
        },
        error: (error) => {
          console.error('Error assigning role:', error);
          this.errorMessage = 'Failed to assign role. Please try again.';
          this.actionLoading = false;
        }
      })
    );
  }

  unassignRole(userId: string, roleId: string, userName: string): void {
    if (!confirm(`Are you sure you want to remove the "${roleId}" role from ${userName}?`)) {
      return;
    }

    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.subscription.add(
      this.adminService.unassignRoleFromUser(userId, roleId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = `Role "${roleId}" removed successfully from ${userName}.`;
            this.loadUsersWithRoles(); // Refresh the list
          } else {
            this.errorMessage = response.message || 'Failed to remove role.';
          }
          this.actionLoading = false;
        },
        error: (error) => {
          console.error('Error removing role:', error);
          this.errorMessage = 'Failed to remove role. Please try again.';
          this.actionLoading = false;
        }
      })
    );
  }

  getAvailableRolesForUser(user: UserRole): string[] {
    return this.availableRoles.filter(role => !user.currentRoles.includes(role));
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
} 