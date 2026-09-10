import { Component, model, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COUNTRY_CODES, CountryCode } from '../core/country-codes';

@Component({
  selector: 'app-phone-input',
  imports: [FormsModule],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.css',
})
export class PhoneInput {
  fullNumber = model<string>('');

  countries = COUNTRY_CODES;
  isOpen = signal(false);
  searchTerm = signal('');
  localNumber = signal('');

  selectedCountry = signal<CountryCode>(
    COUNTRY_CODES.find((c) => c.iso === 'CD') ?? COUNTRY_CODES[0]
  );

  filteredCountries = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.countries;
    return this.countries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.dialCode.includes(term) ||
        c.iso.toLowerCase().includes(term)
    );
  });

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry.set(country);
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.emitFullNumber();
  }

  onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onNumberInput(event: Event): void {
    this.localNumber.set((event.target as HTMLInputElement).value);
    this.emitFullNumber();
  }

  private emitFullNumber(): void {
    const number = this.localNumber().trim().replace(/\s+/g, '');
    this.fullNumber.set(number ? `${this.selectedCountry().dialCode}${number}` : '');
  }
}