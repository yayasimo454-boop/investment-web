import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Auth } from '../../../core/auth';
import { PhoneInput } from '../../../phone-input/phone-input';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, TranslatePipe, PhoneInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  phone = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);

  onSubmit(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.auth.login(this.phone, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Identifiants incorrects.'
        );
      },
    });
  }
}