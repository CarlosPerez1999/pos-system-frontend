import { Component, input, model, ModelSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, AppIcon],
  templateUrl: './app-search-bar.html',
})
/**
 * Search bar component with debounced output.
 */
export class AppSearchBar {
  onSearch = output<string>();
  searchValue: ModelSignal<string> = model('');
  placeholder = input<string>('');
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Emits the search value after a 700ms debounce delay.
   * Clears any pending timeout before setting a new one.
   */
  search() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.onSearch.emit(this.searchValue());
    }, 700);
  }
}
