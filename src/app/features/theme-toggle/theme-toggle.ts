import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle {
  themeService = inject(ThemeService);

  toggle(): void {
    this.themeService.toggleTheme();
  }
}