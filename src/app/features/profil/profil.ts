import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Auth } from '../../core/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  private readonly apiUrl = environment.apiUrl;

  currentUser = this.auth.currentUser;

  name = this.currentUser()?.name ?? '';
  email = this.currentUser()?.email ?? '';

  feedback = signal<string>('');
  loading = signal<boolean>(false);

  save(): void {
    this.loading.set(true);
    this.feedback.set('');

    this.http.put(`${this.apiUrl}/me`, { name: this.name, email: this.email }).subscribe({
      next: (updatedUser: any) => {
        this.loading.set(false);
        this.feedback.set(this.translate.instant('PROFILE.UPDATED'));
        this.auth.currentUser.set(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) => {
        this.loading.set(false);
        this.feedback.set(err.error?.message ?? this.translate.instant('PROFILE.ERROR'));
      },
    });
  }
}