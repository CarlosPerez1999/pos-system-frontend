import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../users/services/users-service';
import {
  AppTable,
  TableColumn,
} from '../../../../shared/components/app-table/app-table';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { AppModal } from '../../../../shared/components/app-modal/app-modal';
import { ModalService } from '../../../../core/services/modal-service';
import { UserAddForm } from '../../../users/components/user-add-form/user-add-form';
import { User } from '../../../../core/models/user.model';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-users',
  imports: [AppTable, AppButton, AppModal, UserAddForm, ReactiveFormsModule],
  templateUrl: './users.html',
})
/**
 * Users page for managing system users.
 * Allows adding and updating user information.
 */
export class UsersPage {
  usersService = inject(UsersService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  selectedUser = signal<User | null>(null);
  columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  /**
   * Opens the modal to create a new user.
   */
  onAdd() {
    this.selectedUser.set(null);
    this.modalService.openModal('create-user');
  }
  /**
   * Opens the modal to update an existing user.
   * Shows a toast if no user is selected.
   */
  onUpdate() {
    if (!this.selectedUser()) {
      this.toastService.showToast({
        type: 'info',
        message: 'Please select a user to update',
      });
      return;
    }
    this.modalService.openModal('update-user');
  }
}
