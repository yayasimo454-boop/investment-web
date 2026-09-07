import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UnifiedChart } from '../dashboard/unified-chart/unified-chart';

@Component({
  selector: 'app-trading',
  imports: [UnifiedChart, TranslatePipe],
  templateUrl: './trading.html',
  styleUrl: './trading.css',
})
export class Trading {}