import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Header, Sidebar, NgxSpinnerModule],
  templateUrl: './expense.html',
  styleUrl: './expense.scss',
})
export class Expense {
  expenseForm!: FormGroup;
  showModal = false;

  isEditMode = false;

  selectedId: any = null;

  submitted = false;

  loading = false;


  expenseList: any[] = [];

  filteredExpense: any[] = [];

  sources: string[] = [];

  searchText = '';

  selectedSource = 'All Sources';

  selectedMonth = 'All';
  profile_data: any


  categories: any = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Others'
  ];

  Expense_dashboard: any


  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;
  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number = 0;

  paginatedExpense: any[] = [];


  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
    if (!this.islogin) {
      window.location.href = '/';
    }
  }





  ngOnInit(): void {
    this.spinner.show()

    this.createExpenseForm();
    this.getExpenseSummary();
    this.getExpenseList();
  }


  openModal() {

    this.isEditMode = false;

    this.selectedId = '';

    this.submitted = false;

    this.expenseForm.reset();

    this.expenseForm.patchValue({
      source: '',
      amount: '',
      description: '',
      date: ''
    });

    this.showModal = true;

    this.cdr.detectChanges();

  }




  closeModal() {

    this.showModal = false;

    this.isEditMode = false;

    this.selectedId = null;

    this.submitted = false;

    this.expenseForm.reset();
    this.cdr.detectChanges();

  }

  editExpense(expense: any) {

    console.log("Edit Expense:", expense);

    this.isEditMode = true;

    this.selectedId = expense._id;

    this.showModal = true;

    this.submitted = false;

    this.expenseForm.patchValue({

      source: expense.source,

      amount: expense.amount,
      paymentType: expense.paymentType,

      description: expense.description,

      date: expense.date
        ? expense.date.split('T')[0]
        : ''

    });

  }

  // CREATE EXPENSE FORM

  createExpenseForm() {

    this.expenseForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentType: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]

    });


  }





  get f() {
    return this.expenseForm.controls;
  }



  // ADD EXPENSE




  addExpense() {

    this.spinner.show();

    this.submitted = true;

    if (this.expenseForm.invalid) {

      this.spinner.hide();

      return;

    }

    const payload: any = {
      ...this.expenseForm.value
    };

    if (this.isEditMode) {

      payload.expenseId = this.selectedId;

      console.log("Update Expense", payload);

      this.apiservice.postRequest('user/updateExpenses', payload).then((resdata: any) => {

        this.spinner.hide();

        if (resdata.status) {

          this.commonservice.openAlert("success", resdata.message);

          this.getExpenseList();
          this.getExpenseSummary();

          this.closeModal();
          this.cdr.detectChanges();

        } else {

          this.commonservice.openAlert("error", resdata.message);

        }

      });

    } else {

      console.log("Add Expense", payload);

      this.apiservice.postRequest('user/addExpenses', payload).then((resdata: any) => {
        this.spinner.hide();

        if (resdata.status) {

          this.commonservice.openAlert("success", resdata.message);

          this.getExpenseList();
          this.getExpenseSummary();

          this.closeModal();
          this.cdr.detectChanges();

        } else {

          this.commonservice.openAlert("error", resdata.message);

        }

      });

    }

  }








  // GET EXPENSE LIST

  async getExpenseList() {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest('user/profile');

      this.spinner.hide();

      if (res.status) {

        this.profile_data = res.data;

        this.expenseList =
          res.data.expenses || [];


        this.expenseList.sort((a: any, b: any) => {

          return b._id.toString().localeCompare(
            a._id.toString()
          );

        });


        this.filteredExpense =
          [...this.expenseList];


        this.sources = [
          'All Sources',
          ...new Set(
            this.expenseList.map(
              (item: any) => item.source
            )
          )
        ];


        this.applyFilters();


        this.currentPage = 1;


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
      this.filteredExpense.length /
      this.itemsPerPage
    );

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    this.paginatedExpense =
      this.filteredExpense.slice(
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


  async getExpenseSummary() {

    try {

      const res: any = await this.apiservice.getRequest('user/expansesDashboard');

      console.log("Expense Summary:", res);

      if (res.status) {

        this.Expense_dashboard = res.data;
        console.log("🚀 ~ Expense ~ getExpenseSummary ~ this.Expense_dashboard :", this.Expense_dashboard)
        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert(
          'error',
          res.message
        );

      }

    } catch (error) {

      console.log(error);

    }

  }



  applyFilters() {

    this.filteredExpense =
      this.expenseList.filter((item: any) => {

        // Search
        const search = this.searchText.toLowerCase();

        const matchSearch = item.source?.toLowerCase().includes(search) || item.description?.toLowerCase().includes(search);


        // Source

        const matchSource = this.selectedSource === 'All Sources' ? true : item.source === this.selectedSource;

        // Month

        let matchMonth = true;

        const itemDate = new Date(item.date);

        const today = new Date();


        if (this.selectedMonth === 'This Month') {

          matchMonth = itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        }


        if (this.selectedMonth === 'Last Month') {

          const lastMonth = new Date(today);

          lastMonth.setMonth(today.getMonth() - 1);

          matchMonth = itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();

        }


        return (matchSearch && matchSource && matchMonth);

      });


    this.currentPage = 1;

    this.updatePagination();

  }







  // DELETE EXPENSE


  deleteExpense(id: string) {

    const payload = {
      expenseId: id
    };

    this.apiservice
      .postRequest('user/deleteExpenses', payload).then((res: any) => {
        if (res.status) {

          this.commonservice.openAlert("success", res.message);

          this.getExpenseList();
          this.getExpenseSummary();

        } else {

          this.commonservice.openAlert("error", res.message);

        }

      });

  }


}
