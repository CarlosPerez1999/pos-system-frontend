import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modals = signal<{ [key: string]: boolean }>({});

  toggleModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: !m[id] }));
  }

  openModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: true }));
  }

  closeModal(id: string) {
    this.modals.update((m) => ({ ...m, [id]: false }));
  }

  isOpen(id: string): boolean {
    return this.modals()[id] || false;
  }
}
