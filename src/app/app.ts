import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme-service';
import { ModalService } from './core/services/modal-service';
import { AppToast } from './shared/components/app-toast/app-toast';
import { ToastService } from './core/services/toast-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppToast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  themeService = inject(ThemeService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
}
