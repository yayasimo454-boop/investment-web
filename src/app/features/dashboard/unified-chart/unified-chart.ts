import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { Market, Asset } from '../../../core/market';

Chart.register(...registerables);

interface AssetRow {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

@Component({
  selector: 'app-unified-chart',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './unified-chart.html',
  styleUrl: './unified-chart.css',
})
export class UnifiedChart implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private market = inject(Market);
  private tickSubscription?: Subscription;
  private chart?: Chart;
  private feedbackTimeout?: ReturnType<typeof setTimeout>;

  private readonly maxPoints = 60;
  private history: Record<string, number[]> = {};

  rows = signal<AssetRow[]>([]);
  selectedSymbol = signal<string>('');
  selectedName = signal<string>('');
  searchTerm = signal<string>('');
  amount = signal<number>(1);
  tradeFeedback = signal<string>('');

  readonly payoutPercent = 72; // valeur simulée — à remplacer par une vraie logique de paiement

  selectedRow = computed(() =>
    this.rows().find((r) => r.symbol === this.selectedSymbol())
  );

  filteredRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.rows();
    return this.rows().filter(
      (r) =>
        r.symbol.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term)
    );
  });

  estimatedGain = computed(() => {
    const gain = (this.amount() * this.payoutPercent) / 100;
    return gain.toFixed(2);
  });

  private viewReady = false;
  private assetsReady = false;

  ngOnInit(): void {
    this.market.getAssets().subscribe((assets: Asset[]) => {
      const initialRows: AssetRow[] = assets.map((a) => {
        const price = a.latest_price ? +a.latest_price.price : 0;
        this.history[a.symbol] = [price];
        return { symbol: a.symbol, name: a.name, price, changePercent: 0 };
      });

      this.rows.set(initialRows);

      if (initialRows.length > 0) {
        this.selectedSymbol.set(initialRows[0].symbol);
        this.selectedName.set(initialRows[0].name);
      }

      this.assetsReady = true;
      this.tryBuildChart();
      this.subscribeToTicks();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy(): void {
    this.tickSubscription?.unsubscribe();
    this.chart?.destroy();
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onAmountChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.amount.set(value > 0 ? value : 1);
  }

  selectAsset(row: AssetRow): void {
    this.selectedSymbol.set(row.symbol);
    this.selectedName.set(row.name);
    this.updateChart(row.changePercent);
  }

  buyAsset(): void {
    const row = this.selectedRow();
    if (!row) return;
    this.showFeedback(`Achat simulé de $${this.amount()} sur ${row.symbol} à ${row.price.toFixed(4)}`);
  }

  sellAsset(): void {
    const row = this.selectedRow();
    if (!row) return;
    this.showFeedback(`Vente simulée de $${this.amount()} sur ${row.symbol} à ${row.price.toFixed(4)}`);
  }

  private showFeedback(message: string): void {
    this.tradeFeedback.set(message);
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedbackTimeout = setTimeout(() => this.tradeFeedback.set(''), 3000);
  }

  private tryBuildChart(): void {
    if (!this.viewReady || !this.assetsReady || this.chart) return;
    this.buildChart();
  }

  private subscribeToTicks(): void {
    this.tickSubscription = this.market.ticks$.subscribe((results) => {
      if (!results.length) return;

      const rowMap = new Map(this.rows().map((r) => [r.symbol, r]));

      for (const result of results) {
        if (!this.history[result.symbol]) {
          this.history[result.symbol] = [];
        }
        this.history[result.symbol].push(result.price);
        if (this.history[result.symbol].length > this.maxPoints) {
          this.history[result.symbol].shift();
        }

        rowMap.set(result.symbol, {
          symbol: result.symbol,
          name: rowMap.get(result.symbol)?.name ?? result.symbol,
          price: result.price,
          changePercent: result.change_percent,
        });
      }

      this.rows.set(
        [...rowMap.values()].sort((a, b) => a.symbol.localeCompare(b.symbol))
      );

      const selected = this.rows().find((r) => r.symbol === this.selectedSymbol());
      if (selected) {
        this.updateChart(selected.changePercent);
      }
    });
  }

  private buildChart(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const symbol = this.selectedSymbol();
    const data = [...(this.history[symbol] ?? [])];

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: data.map(() => ''),
        datasets: [
          {
            data,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56,189,248,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: 'nearest', intersect: false },
        scales: {
          x: { display: false },
          y: {
            display: true,
            ticks: { color: '#94a3b8', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true, mode: 'nearest', intersect: false },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(changePercent: number): void {
    if (!this.chart) return;

    const symbol = this.selectedSymbol();
    const data = this.history[symbol] ?? [];

    this.chart.data.labels = data.map(() => '');
    this.chart.data.datasets[0].data = [...data];
    this.chart.update('none');
  }
}