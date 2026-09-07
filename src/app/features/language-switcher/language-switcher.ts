import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  currentLang = 'fr';

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}