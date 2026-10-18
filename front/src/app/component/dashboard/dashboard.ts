import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Header } from "../header/header";
import { RouterLink } from "@angular/router";
import { Sidebar } from '../sidebar/sidebar';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, NgxEchartsDirective, Header, RouterLink, Sidebar, NgxSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {


  dashboardData: any = null;

  incomeExpenseChart: any;
  categoryChart: any;

  profile_data: any;
  greeting: string = '';

  sidebarOpen = false;

  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;

  constructor(private apiservice: ApiserviceService, private commonservice: CommonService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
    if (!this.islogin) {
      window.location.href = '/';
    }
  }


  ngOnInit(): void {
    this.spinner.show()
    this.getprofile();
    this.setGreeting();
    this.getDashboard();
  }



  async getprofile() {

    try {

      this.spinner.show();

      const res: any = await this.apiservice.getRequest('user/profile');

      this.spinner.hide();

      console.log(res);

      if (res.status) {

        this.profile_data = res.data;
        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert('error', res.message);

      }

    } catch (err) {

      this.spinner.hide();

      console.log(err);

    }

  }


  async getDashboard() {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest('user/dashboard_data');

      this.spinner.hide();

      console.log(
        'Dashboard Response:',
        res
      );

      if (res.status) {

        this.dashboardData = res.data;

        this.profile_data = res.data;

        this.setIncomeExpenseChart();

        this.setCategoryChart();

        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert(
          'error',
          res.message
        );

      }

    } catch (error) {

      this.spinner.hide();

      console.log(
        'Dashboard API Error:',
        error
      );

    }

  }


  setIncomeExpenseChart() {

    const data = this.dashboardData;

    this.incomeExpenseChart = {

      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: [
          'Income',
          'Expense'
        ]
      },

      xAxis: {

        type: 'category',

        data: data.monthly.months

      },

      yAxis: {

        type: 'value'

      },

      series: [

        {
          name: 'Income',

          type: 'bar',

          data: data.monthly.income
        },

        {
          name: 'Expense',

          type: 'bar',

          data: data.monthly.expense
        }

      ]

    };

  }


  hasIncomeExpenseData(): boolean {

    const income =
      this.dashboardData?.monthly?.income || [];

    const expense =
      this.dashboardData?.monthly?.expense || [];

    return (
      income.some((value: number) => value > 0) ||
      expense.some((value: number) => value > 0)
    );

  }

  hasCategoryData(): boolean {

    const categories =
      this.dashboardData?.categoryExpenses || [];

    return categories.length > 0;

  }

  setCategoryChart() {

    const data = this.dashboardData;

    this.categoryChart = {

      tooltip: {
        trigger: 'item'
      },

      legend: {
        bottom: '0'
      },

      series: [

        {

          name: 'Expense',

          type: 'pie',

          radius: '65%',

          data: data.categoryExpenses

        }

      ]

    };

  }


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  setGreeting(): void {

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {

      this.greeting = 'Good Morning';

    } else if (hour >= 12 && hour < 17) {

      this.greeting = 'Good Afternoon';

    } else if (hour >= 17 && hour < 21) {

      this.greeting = 'Good Evening';

    } else {

      this.greeting = 'Good Night';

    }

  }

}
