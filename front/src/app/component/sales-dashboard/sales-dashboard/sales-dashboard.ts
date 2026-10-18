import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice/apiservice-service';
import { CommonService } from '../../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

Chart.register(...registerables);

interface KPIData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  aovGrowth: number;
  conversionGrowth: number;
}

interface ProductItem {
  rank: number;
  name: string;
  sales: number;
  icon: string;
}

interface RegionItem {
  name: string;
  sales: number;
  percentage: number;
  color: string;
}

interface InsightCard {
  title: string;
  desc: string;
  value: string;
  icon: string;
  type: string;
}

interface FunnelStep {
  label: string;
  value: string;
  width: string;
  color: string;
}

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxSpinnerModule],
  styleUrl: './sales-dashboard.scss',
  templateUrl: './sales-dashboard.html'
})
export class SalesDashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesTimeCanvas') salesTimeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('channelCanvas') channelCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryCanvas') categoryCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customersCanvas') customersCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiserviceService,
    private commonservice: CommonService
  ) { }

  // State
  fileName = signal<string>('');
  isProcessing = signal<boolean>(false);
  activeTab = signal<string>('OVERVIEW');
  errorMessage = signal<string>('');

  // Backend response cache
  private metricsData: any = null;

  // KPI cards
  kpis = signal<KPIData>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    aovGrowth: 0,
    conversionGrowth: 0
  });

  topProducts = signal<ProductItem[]>([]);
  regions = signal<RegionItem[]>([]);
  funnelSteps = signal<FunnelStep[]>([]);
  insights = signal<InsightCard[]>([]);

  heatmapDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  heatmapHours = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'];

  heatmapMatrix = signal<number[][]>(
    Array.from({ length: 7 }, () => Array(6).fill(0.1))
  );

  navItems = [
    { id: 'OVERVIEW', label: 'OVERVIEW', icon: '📊' },
    { id: 'SALES', label: 'SALES', icon: '📈' },
    { id: 'PRODUCTS', label: 'PRODUCTS', icon: '📦' },
    { id: 'CUSTOMERS', label: 'CUSTOMERS', icon: '👥' },
    { id: 'REGIONS', label: 'REGIONS', icon: '🌐' },
    { id: 'CHANNELS', label: 'CHANNELS', icon: '🛒' },
    { id: 'ORDERS', label: 'ORDERS', icon: '📋' },
    { id: 'RETURNS', label: 'RETURNS', icon: '↩️' },
    { id: 'SETTINGS', label: 'SETTINGS', icon: '⚙️' }
  ];

  // Charts
  private salesTimeChart: Chart | null = null;
  private channelChart: Chart | null = null;
  private categoryChart: Chart | null = null;
  private customersChart: Chart | null = null;

  ngOnInit(): void {
    this.spinner.show()
    this.loadMetrics();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      if (this.metricsData) {
        this.updateCharts();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.salesTimeChart?.destroy();
    this.channelChart?.destroy();
    this.categoryChart?.destroy();
    this.customersChart?.destroy();
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
  }

  // ==========================================
  // LOAD METRICS FROM BACKEND
  // ==========================================
  async loadMetrics(): Promise<void> {
    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const res: any = await this.apiService.getRequest('user/metrics');
      this.spinner.hide()
      if (res?.status && res?.data) {
        const data = res.data;

        // CRUCIAL: Cache the response so updateCharts() can access it!
        this.metricsData = data;

        if (data.kpis) this.kpis.set(data.kpis);
        if (data.topProducts) this.topProducts.set(data.topProducts);
        if (data.regions) this.regions.set(data.regions);
        if (data.funnelSteps) this.funnelSteps.set(data.funnelSteps);
        if (data.insights) this.insights.set(data.insights);
        if (data.heatmapMatrix) this.heatmapMatrix.set(data.heatmapMatrix);

        this.updateCharts();
      } else if (res?.empty) {
        this.resetDashboard();
      } else {
        this.errorMessage.set(res?.message || 'Metrics response-la data illa.');
      }
    } catch (err: any) {
      console.error('Metrics API error:', err);
      this.errorMessage.set(err?.message || 'Metrics API failed.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  // ==========================================
  // UPLOAD FILE TO BACKEND
  // ==========================================
  async onFileSelect(event: Event): Promise<void> {
    this.spinner.show()

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.fileName.set(file.name);
    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res: any = await this.apiService.postFileRequest(
        'user/upload',
        formData
      );
      if (!res?.status) {
        this.spinner.hide()
        this.commonservice.openAlert(
          'error',
          res?.message || 'File upload failed!'
        );
        return;
      }
      this.spinner.hide()

      this.commonservice.openAlert(
        'success',
        res?.message || 'File uploaded successfully!'
      );

      await this.loadMetrics();
    } catch (error: any) {
      console.error('Upload error:', error);
      const message =
        error?.error?.message ||
        error?.message ||
        'Image upload failed. Please try again.';
      this.commonservice.openAlert('error', message);
    } finally {
      input.value = '';
      this.isProcessing.set(false);
    }
  }

  // ==========================================
  // RESET DASHBOARD WHEN NO DATA EXISTS
  // ==========================================
  private resetDashboard(): void {
    this.metricsData = null;
    this.kpis.set({
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      salesGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      aovGrowth: 0,
      conversionGrowth: 0
    });

    this.topProducts.set([]);
    this.regions.set([]);
    this.funnelSteps.set([]);
    this.insights.set([]);
    this.heatmapMatrix.set(
      Array.from({ length: 7 }, () => Array(6).fill(0.1))
    );

    this.clearCharts();
  }

  // ==========================================
  // UPDATE CHARTS FROM BACKEND RESPONSE
  // ==========================================
  private updateCharts(): void {
    const d = this.metricsData;

    if (!d) {
      this.clearCharts();
      return;
    }

    // 1. Monthly sales & orders (Line Chart)
    if (this.salesTimeChart) {
      const trend = d.monthlyTrend ?? {};
      const months = trend.months?.length
        ? trend.months
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      this.salesTimeChart.data.labels = months;

      if (this.salesTimeChart.data.datasets[0]) {
        this.salesTimeChart.data.datasets[0].data = (trend.sales ?? []).map(Number);
      }
      if (this.salesTimeChart.data.datasets[1]) {
        this.salesTimeChart.data.datasets[1].data = (trend.orders ?? []).map(Number);
      }
      this.salesTimeChart.update();
    }

    // 2. Sales by Channel (Donut Chart)
    if (this.channelChart) {
      const channels = d.channels ?? [];

      const labels = channels.map((c: any) => {
        const name = c.name ?? c._id ?? 'Unknown';
        const pct = c.percentage !== undefined ? Number(c.percentage).toFixed(1) : '0';
        return `${name} (${pct}%)`;
      });

      const values = channels.map((c: any) => Number(c.sales ?? c.total ?? 0));

      this.channelChart.data.labels = labels;
      this.channelChart.data.datasets[0].data = values;
      this.channelChart.update();
    }

    // 3. Sales by Category (Horizontal Bar Chart)
    if (this.categoryChart) {
      const categories = d.categories ?? [];

      this.categoryChart.data.labels = categories.map((c: any) =>
        String(c.name ?? c._id ?? 'Unknown')
      );

      this.categoryChart.data.datasets[0].data = categories.map((c: any) =>
        Number(c.sales ?? c.total ?? 0)
      );

      this.categoryChart.update();
    }

    // 4. New vs Returning Customers (Donut Chart)
    if (this.customersChart) {
      const split = d.customerSplit ?? {};

      const newCount = Number(split.newCount ?? (split.new ? split.new : 0));
      const returningCount = Number(split.returningCount ?? (split.returning ? split.returning : 0));

      const total = newCount + returningCount || 1;
      const newPct = split.newCustomerPct !== undefined
        ? Number(split.newCustomerPct).toFixed(1)
        : ((newCount / total) * 100).toFixed(1);
      const returningPct = split.returningCustomerPct !== undefined
        ? Number(split.returningCustomerPct).toFixed(1)
        : ((returningCount / total) * 100).toFixed(1);

      this.customersChart.data.labels = [
        `New Customers (${newPct}%)`,
        `Returning (${returningPct}%)`
      ];

      this.customersChart.data.datasets[0].data = [newCount, returningCount];
      this.customersChart.update();
    }
  }

  // Clear chart data
  private clearCharts(): void {
    if (this.salesTimeChart) {
      this.salesTimeChart.data.labels = [];
      this.salesTimeChart.data.datasets.forEach(ds => (ds.data = []));
      this.salesTimeChart.update();
    }

    if (this.channelChart) {
      this.channelChart.data.labels = [];
      this.channelChart.data.datasets[0].data = [];
      this.channelChart.update();
    }

    if (this.categoryChart) {
      this.categoryChart.data.labels = [];
      this.categoryChart.data.datasets[0].data = [];
      this.categoryChart.update();
    }

    if (this.customersChart) {
      this.customersChart.data.labels = [];
      this.customersChart.data.datasets[0].data = [];
      this.customersChart.update();
    }
  }

  // ==========================================
  // CHART INITIALIZATION
  // ==========================================
  private initCharts(): void {
    // 1. Sales over time
    if (this.salesTimeCanvas?.nativeElement) {
      this.salesTimeChart?.destroy();
      this.salesTimeChart = new Chart(this.salesTimeCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Sales ($)',
              data: [],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              yAxisID: 'ySales',
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#10b981',
              pointRadius: 4
            },
            {
              label: 'Orders',
              data: [],
              borderColor: '#059669',
              borderDash: [5, 5],
              yAxisID: 'yOrders',
              tension: 0.35,
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'start',
              labels: { boxWidth: 10, font: { size: 11, weight: 'bold' } }
            }
          },
          scales: {
            ySales: {
              type: 'linear',
              position: 'left',
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: (value) => '$' + Number(value).toLocaleString()
              }
            },
            yOrders: {
              type: 'linear',
              position: 'right',
              grid: { display: false },
              ticks: { callback: (value) => value }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Sales by channel
    if (this.channelCanvas?.nativeElement) {
      this.channelChart?.destroy();
      this.channelChart = new Chart(this.channelCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [
                '#10b981',
                '#3b82f6',
                '#8b5cf6',
                '#f59e0b',
                '#ef4444',
                '#14b8a6'
              ],
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } }
            }
          }
        }
      });
    }

    // 3. Sales by category
    if (this.categoryCanvas?.nativeElement) {
      this.categoryChart?.destroy();
      this.categoryChart = new Chart(this.categoryCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Sales',
              data: [],
              backgroundColor: '#10b981',
              borderRadius: 6
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: {
                callback: (value) => '$' + Number(value).toLocaleString()
              }
            },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // 4. New vs returning customers
    if (this.customersCanvas?.nativeElement) {
      this.customersChart?.destroy();
      this.customersChart = new Chart(this.customersCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: ['#10b981', '#3b82f6'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } }
            }
          }
        }
      });
    }
  }

  getHeatmapOpacity(dayIndex: number, hourIndex: number): number {
    return this.heatmapMatrix()[dayIndex]?.[hourIndex] ?? 0.1;
  }
}