import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tournois',
  imports: [TranslatePipe],
  templateUrl: './tournois.html',
  styleUrl: './tournois.css',
})
export class Tournois {}