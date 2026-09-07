import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface FaqItem {
  questionKey: string;
  answerKey: string;
  open: boolean;
}

@Component({
  selector: 'app-assistance',
  imports: [TranslatePipe],
  templateUrl: './assistance.html',
  styleUrl: './assistance.css',
})
export class Assistance {
  faqs = signal<FaqItem[]>([
    { questionKey: 'ASSISTANCE.Q1', answerKey: 'ASSISTANCE.A1', open: false },
    { questionKey: 'ASSISTANCE.Q2', answerKey: 'ASSISTANCE.A2', open: false },
    { questionKey: 'ASSISTANCE.Q3', answerKey: 'ASSISTANCE.A3', open: false },
    { questionKey: 'ASSISTANCE.Q4', answerKey: 'ASSISTANCE.A4', open: false },
  ]);

  toggle(index: number): void {
    this.faqs.update((items) =>
      items.map((item, i) => (i === index ? { ...item, open: !item.open } : item))
    );
  }
}