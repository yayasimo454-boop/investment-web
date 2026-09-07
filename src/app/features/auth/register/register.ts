import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Auth } from '../../../core/auth';
import { PhoneInput } from '../../../phone-input/phone-input';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, TranslatePipe, PhoneInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);

  name = '';
  phone = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  errorMessage = signal('');
  isLoading = signal(false);

  onSubmit(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.auth
      .register(this.name, this.phone, this.password, this.passwordConfirmation, this.email)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          const errors = err.error?.errors;
          if (errors) {
            this.errorMessage.set(Object.values(errors).flat().join(' '));
          } else {
            this.errorMessage.set(err.error?.message || 'Une erreur est survenue.');
          }
        },
      });
  }
}