import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminUserDTO, RoleType, UserRolesUpdateDTO } from '../../../../Interfaces/iadmin-user-management';
import { AdminUserManagementService } from '../../../../Services/admin-user-management.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  users: AdminUserDTO[] = [];
  availableRoles: RoleType[] = Object.values(RoleType);
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedUser: AdminUserDTO | null = null;
  selectedRole: RoleType | '' = '';
  actionLoading = false;

  private subscription = new Subscription();

  constructor(private adminService: AdminUserManagementService) {}

  ngOnInit(): void {
    this.loadUsersWithRoles();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** Load all users with their roles */
  loadUsersWithRoles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.adminService.getAllUsers(1, 50).subscribe({
        next: (response) => {
          console.log('Users with roles:', response);
          if (response.success && response.data?.items) {
            this.users = response.data.items;
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

  /** Select a user for role changes */
  selectUser(user: AdminUserDTO): void {
    this.selectedUser = user;
    this.selectedRole = '';
    this.clearMessages();
  }

  /** Assign a role to the selected user */
  assignRole(): void {
    if (!this.selectedUser || !this.selectedRole) {
      this.errorMessage = 'Please select both a user and a role.';
      return;
    }

    this.actionLoading = true;
    this.clearMessages();

    const updatedRoles: RoleType[] = [...this.selectedUser.roles, this.selectedRole];
    const dto: UserRolesUpdateDTO = { roles: updatedRoles };

    this.subscription.add(
      this.adminService.changeUserRoles(this.selectedUser.id, dto).subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response);
            this.successMessage = `Role "${this.selectedRole}" assigned successfully to ${this.selectedUser?.fullName}.`;
            this.loadUsersWithRoles();
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

  /** Remove a role from a user */
  unassignRole(user: AdminUserDTO, roleToRemove: RoleType): void {
    if (!confirm(`Are you sure you want to remove the "${roleToRemove}" role from ${user.fullName}?`)) {
      return;
    }

    this.actionLoading = true;
    this.clearMessages();

    const updatedRoles: RoleType[] = user.roles.filter(r => r !== roleToRemove);
    const dto: UserRolesUpdateDTO = { roles: updatedRoles };

    this.subscription.add(
      this.adminService.changeUserRoles(user.id, dto).subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response);
            this.successMessage = `Role "${roleToRemove}" removed successfully from ${user.fullName}.`;
            this.loadUsersWithRoles();
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

  /** Get the list of roles a user does not yet have */
  getAvailableRolesForUser(user: AdminUserDTO): RoleType[] {
    return this.availableRoles.filter(role => !user.roles.includes(role));
  }

  /** Clear messages from UI */
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
