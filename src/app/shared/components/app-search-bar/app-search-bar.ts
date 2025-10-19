import { Component, input, model, ModelSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './app-search-bar.html',
})
export class AppSearchBar {
  onSearch = output<string>();
  searchValue: ModelSignal<string> = model('');
  placeholder = input<string>('');
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  search() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.onSearch.emit(this.searchValue());
    }, 700);
  }
}
