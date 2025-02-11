import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <input
        type="text"
        [(ngModel)]="cityInput"
        placeholder="Inserisci una città"
      />
      <button (click)="updateCity()">Cerca</button>
    </div>
  `,
  styles: `

.search-bar {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #0f172a;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.search-bar button {
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
}

.search-bar button:hover {
  background-color: var(--primary-color);
}

.search-bar button:active {
  transform: scale(0.95);
}`,
})
export class NavbarComponent {
  @Output() citySearch = new EventEmitter<string>();
  cityInput: string = '';

  updateCity(): void {
    if (this.cityInput.trim()) {
      this.citySearch.emit(this.cityInput);
    }
  }
}
