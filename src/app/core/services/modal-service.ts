import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to manage the state of modals in the application.
 * Allows opening, closing, and toggling modals by their ID.
 */
export class ModalService {
  modals = signal<{ [key: string]: boolean }>({});

  /**
   * Toggles the visibility state of a modal by its ID.
   * @param id The unique identifier of the modal.
   */
  toggleModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: !m[id] }));
  }

  /**
   * Opens a modal by its ID.
   * @param id The unique identifier of the modal.
   */
  openModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: true }));
  }

  /**
   * Closes a modal by its ID.
   * @param id The unique identifier of the modal.
   */
  closeModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: false }));
  }

  /**
   * Checks if a modal is currently open.
   * @param id The unique identifier of the modal.
   * @returns True if the modal is open, false otherwise.
   */
  isOpen(id: string): boolean {
    return this.modals()[id] || false;
  }
}
