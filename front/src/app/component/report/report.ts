import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Header, Sidebar, NgxEchartsModule, NgxSpinnerModule],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {

  totalIncome: number = 0;

  totalExpense: number = 0;

  savings: number = 0;

  savingsRate: number = 0;


  monthlyReports: any[] = [];


  selectedPeriod: string = 'This Year';

  selectedCategory: string = 'All Categories';

  categories: string[] = [
    'All Categories'
  ];



  reportData: any = null;


  incomeExpenseChartOption: any = {};

  expenseChartOption: any = {};



  islogin: any =
    localStorage.getItem('traker_TOKEN') ??
    sessionStorage.getItem('traker_TOKEN') ??
    null;


  constructor(
    private apiservice: ApiserviceService,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {

    if (!this.islogin) {

      window.location.href = '/';

    }

  }


  ngOnInit(): void {
    this.spinner.show();
    this.getReport();

  }

  async getReport() {

    try {

      this.spinner.show();
      const params = {

        period: this.selectedPeriod,

        category: this.selectedCategory

      };



      const res: any = await this.apiservice.postRequest('user/report_data', params);

      console.log(
        'Report Response:',
        res
      );


      if (res?.status) {



        this.reportData = res.data;


        this.totalIncome = Number(res.data?.totalIncome || 0);


        this.totalExpense = Number(res.data?.totalExpense || 0);


        this.savings = Number(res.data?.savings || 0);


        this.savingsRate = Number(res.data?.savingsRate || 0);


        this.monthlyReports = res.data?.monthlyReports || [];




        const expenseCategories =
          res.data?.expenseCategories || [];



        const categoryNames =
          expenseCategories
            .map((item: any) => item?.name)
            .filter(
              (name: string) => !!name
            );


        this.categories = [
          'All Categories',
          ...categoryNames
        ];




        this.setIncomeExpenseChart(
          res.data?.chart
        );


        this.setExpenseChart(
          expenseCategories
        );


        this.cdr.detectChanges();


      } else {


        this.resetReport();


        this.commonservice.openAlert(
          'error',
          res?.message || 'Unable to load report.'
        );

      }


    } catch (error) {

      console.log(
        'Report API Error:',
        error
      );

      this.resetReport();


    } finally {

      this.spinner.hide();

    }

  }

  hasIncomeExpenseData(): boolean {

    const income =
      this.incomeExpenseChartOption?.series?.[0]?.data || [];

    const expense =
      this.incomeExpenseChartOption?.series?.[1]?.data || [];

    return (
      income.some((value: any) => Number(value) > 0) ||
      expense.some((value: any) => Number(value) > 0)
    );

  }


  hasExpenseCategoryData(): boolean {

    const data =
      this.expenseChartOption?.series?.[0]?.data || [];

    return data.some(
      (item: any) => Number(item?.value || 0) > 0
    );

  }

  setIncomeExpenseChart(chartData: any) {

    if (!chartData) {

      this.incomeExpenseChartOption = {};

      return;

    }

    this.incomeExpenseChartOption = {

      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: [
          'Income',
          'Expense'
        ]
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: chartData.months || []
      },

      yAxis: {
        type: 'value'
      },

      series: [

        {
          name: 'Income',
          type: 'bar',
          data: chartData.income || []
        },

        {
          name: 'Expense',
          type: 'bar',
          data: chartData.expense || []
        }

      ]

    };

  }

  setExpenseChart(categories: any[]) {

    this.expenseChartOption = {

      tooltip: {
        trigger: 'item',
        formatter: '{b}: ₹{c} ({d}%)'
      },

      legend: {
        bottom: 0
      },

      series: [

        {
          name: 'Expense',
          type: 'pie',
          radius: '60%',

          center: [
            '50%',
            '45%'
          ],

          data: categories || [],

          emphasis: {

            itemStyle: {

              shadowBlur: 10,

              shadowOffsetX: 0,

              shadowColor:
                'rgba(0, 0, 0, 0.5)'

            }

          }

        }

      ]

    };

  }



  resetReport() {

    this.totalIncome = 0;

    this.totalExpense = 0;

    this.savings = 0;

    this.savingsRate = 0;

    this.monthlyReports = [];

    this.reportData = null;

    this.incomeExpenseChartOption = {};

    this.expenseChartOption = {};

  }





  exportReport(): void {

    if (!this.monthlyReports || this.monthlyReports.length === 0) {
      alert('No report data available to export.');
      return;
    }

    let csvContent = '';

    // Report title
    csvContent += 'Financial Report\n';
    csvContent += `Generated Date,${new Date().toLocaleDateString('en-IN')}\n\n`;

    // Summary
    csvContent += 'Summary\n';
    csvContent += 'Total Income,Total Expense,Total Savings,Savings Rate\n';
    csvContent += `${this.totalIncome},${this.totalExpense},${this.savings},${this.savingsRate}%\n\n`;

    // Monthly report
    csvContent += 'Monthly Summary\n';
    csvContent += 'Month,Income,Expense,Savings\n';

    this.monthlyReports.forEach((report: any) => {

      csvContent += `"${report.month}",${report.income},${report.expense},${report.savings}\n`;

    });

    // Create file
    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `Financial_Report_${this.getFileDate()}.csv`;

    link.click();

    window.URL.revokeObjectURL(url);
  }


  getFileDate(): string {

    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

}
