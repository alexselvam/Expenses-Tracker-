import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from "../header/header";
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-income',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Sidebar, Header, NgxSpinnerModule],
  templateUrl: './income.html',
  styleUrl: './income.scss',
})
export class Income {
  incomeForm!: FormGroup;
  showModal = false;

  isEditMode = false;

  selectedId: any = null;

  submitted = false;

  loading = false;
  dashboardData: any = {};


  incomeList: any[] = [];
  profile_data: any
  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;

  filteredIncome: any[] = [];

  sources: string[] = [];

  searchText: string = '';

  selectedSource: string = 'All Sources';

  selectedMonth: string = 'All';


  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number = 0;

  paginatedIncome: any[] = [];

  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
    if (!this.islogin) {
      window.location.href = '/';
    }
  }




  ngOnInit(): void {

    this.spinner.show()
    this.createIncomeForm();


    this.getIncomeList();
    this.getDashboard();


  }



  getDashboard() {

    this.apiservice.getRequest('user/incomeDashboard').then((res: any) => {
      if (res.status) {
        this.dashboardData = res.data;
        this.cdr.detectChanges();
        console.log("🚀 ~ Income ~ getDashboard ~ this.dashboardData:", this.dashboardData)
      }

    });

  }


  openModal() {

    this.isEditMode = false;

    this.showModal = true;

    this.submitted = false;

    this.incomeForm.reset();

  }


  closeModal() {

    this.showModal = false;

    this.isEditMode = false;

    this.selectedId = null;

    this.submitted = false;

    this.incomeForm.reset();

  }


  editIncome(income: any) {
    console.log("🚀 ~ Income ~ editIncome ~ income:", income)

    this.isEditMode = true;

    this.showModal = true;

    this.selectedId = income._id;

    this.incomeForm.patchValue({

      source: income.source,

      amount: income.amount,

      description: income.description,
      paymentType: income.paymentType,

      date: income.date.split('T')[0]

    });
    // this.openModal();

  }


  // CREATE FORM

  createIncomeForm() {


    this.incomeForm = this.fb.group({


      source: ['', Validators.required],

      amount: ['', [Validators.required, Validators.min(1)]],
      paymentType: ['', Validators.required],

      description: ['', Validators.required],

      date: ['', Validators.required]

    });


  }


  get f() {
    return this.incomeForm.controls;
  }





  // ADD INCOME

  addIncome() {

    this.submitted = true;

    if (this.incomeForm.invalid) {
      return;
    }

    this.spinner.show();

    const payload = {
      ...this.incomeForm.value,
      incomeId: this.selectedId
    };

    console.log("Is Edit Mode:", this.isEditMode);
    console.log("Payload:", payload);

    if (this.isEditMode) {

      this.apiservice.postRequest('user/updateIncome', payload)
        .then((resdata: any) => {

          this.spinner.hide();

          if (resdata.status) {

            this.commonservice.openAlert("success", resdata.message);

            this.getIncomeList();
            this.getDashboard();

            this.closeModal();

            this.incomeForm.reset();

            this.submitted = false;

            this.isEditMode = false;

          } else {

            this.commonservice.openAlert("error", resdata.message);

          }

        });

    } else {

      this.apiservice.postRequest('user/addIncome', this.incomeForm.value)
        .then((resdata: any) => {

          this.spinner.hide();

          if (resdata.status) {

            this.commonservice.openAlert("success", resdata.message);

            this.getIncomeList();
            this.getDashboard();
            this.closeModal();

            this.incomeForm.reset();

            this.submitted = false;

          } else {

            this.commonservice.openAlert("error", resdata.message);

          }

        });

    }

  }



  // GET INCOME LIST



  async getIncomeList() {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest('user/profile');

      this.spinner.hide();

      if (res.status) {

        this.profile_data = res.data;

        this.incomeList = res.data.income || [];

        this.incomeList.sort((a: any, b: any) => {

          return b._id.toString().localeCompare(
            a._id.toString()
          );

        });

        this.filteredIncome = [...this.incomeList];


        this.sources = [
          'All Sources',
          ...new Set(
            this.incomeList.map(
              (item: any) => item.source
            )
          )
        ];


        this.applyFilters();

        this.currentPage = 1;

        // Pagination
        this.updatePagination();

        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert(
          'error',
          res.message
        );

      }

    } catch (err) {

      this.spinner.hide();

      console.log(err);

    }

  }

  updatePagination() {

    this.totalPages = Math.ceil(
      this.filteredIncome.length /
      this.itemsPerPage
    );

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    this.paginatedIncome =
      this.filteredIncome.slice(
        startIndex,
        endIndex
      );

  }

  changePage(page: number) {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.updatePagination();

  }



  applyFilters() {

    this.filteredIncome = this.incomeList.filter((item: any) => {

      const search = this.searchText.toLowerCase();

      const matchSearch =

        item.source.toLowerCase().includes(search) ||

        item.description.toLowerCase().includes(search);


      const matchSource = this.selectedSource === 'All Sources' ? true : item.source === this.selectedSource;

      let matchMonth = true;

      const itemDate = new Date(item.date);

      const today = new Date();

      if (this.selectedMonth === 'This Month') {

        matchMonth =

          itemDate.getMonth() === today.getMonth() &&

          itemDate.getFullYear() === today.getFullYear();

      }

      else if (this.selectedMonth === 'Last Month') {

        const lastMonth = new Date();

        lastMonth.setMonth(today.getMonth() - 1);

        matchMonth =

          itemDate.getMonth() === lastMonth.getMonth() &&

          itemDate.getFullYear() === lastMonth.getFullYear();

      }

      return matchSearch && matchSource && matchMonth;

    });

    this.currentPage = 1;

    this.updatePagination();

  }





  // DELETE INCOME


  deleteIncome(id: string) {

    const payload = {
      incomeId: id
    };

    this.apiservice.postRequest('user/deleteIncome', payload).then((res: any) => {

      if (res.status) {

        this.commonservice.openAlert("success", res.message);
        this.getIncomeList();
        this.getDashboard();

      } else {

        this.commonservice.openAlert("error", res.message);

      }

    });

  }
}
