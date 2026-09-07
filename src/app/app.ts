import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from './features/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('investment-web');
}