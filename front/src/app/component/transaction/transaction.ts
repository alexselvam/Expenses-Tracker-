import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Sidebar, Header, NgxSpinnerModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
})
export class Transaction {
  transactionForm!: FormGroup;
  showModal = false;
  isEditMode = false;

  selectedId: any = null;

  submitted = false;

  loading = false;


  transactions: any[] = [];
  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;
  totalTransactions: any
  searchText: string = '';

  selectedType: string = 'All';

  selectedMonth: string = 'All';


  filteredTransactions: any[] = [];

  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number = 0;

  paginatedTransactions: any[] = [];


  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
    if (!this.islogin) {
      window.location.href = '/';
    }
  }


  ngOnInit(): void {
    this.spinner.show()
    this.getTransactions();


  }


  openModal() {

    this.isEditMode = false;

    this.showModal = true;

    this.transactionForm.reset({

      type: 'expense'

    });

  }

  closeModal() {

    this.showModal = false;

    this.isEditMode = false;

    this.selectedId = null;

    this.submitted = false;

    this.transactionForm.reset({

      type: 'expense'

    });

  }









  editTransaction(transaction: any) {

    this.isEditMode = true;

    this.showModal = true;

    this.selectedId = transaction._id;

    this.transactionForm.patchValue({

      type: transaction.type,

      amount: transaction.amount,

      category: transaction.category,

      description: transaction.description,

      date: transaction.date

    });

  }



  // GET TRANSACTION LIST


  async getTransactions() {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest('user/getTransactions');

      this.spinner.hide();

      console.log('Transactions Response:', res);

      if (res.status) {

        this.totalTransactions = res.data?.summary;

        this.transactions = res.data?.transactions || [];

        this.transactions.sort((a: any, b: any) => {

          return b._id.toString().localeCompare(
            a._id.toString()
          );

        });

        this.filteredTransactions = [...this.transactions];

        this.currentPage = 1;

        this.updatePagination();

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
        'Transaction API Error:',
        error
      );

    }

  }

  updatePagination() {

    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);

    // Current page data

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);

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

    this.filteredTransactions = this.transactions.filter(
      (item: any) => {

        const search =
          this.searchText.trim().toLowerCase();


        // Search
        const matchSearch =

          (item.category || '')
            .toLowerCase()
            .includes(search)

          ||

          (item.description || '')
            .toLowerCase()
            .includes(search);


        // Type
        const matchType =

          this.selectedType === 'All'
            ? true
            : item.type === this.selectedType.toLowerCase();


        // Month
        let matchMonth = true;


        const itemDate =
          new Date(item.date);

        const today =
          new Date();


        // This Month

        if (this.selectedMonth === 'This Month') {

          matchMonth =

            itemDate.getMonth() ===
            today.getMonth()

            &&

            itemDate.getFullYear() ===
            today.getFullYear();

        }


        // Last Month

        else if (
          this.selectedMonth === 'Last Month'
        ) {

          const lastMonth =
            new Date();

          lastMonth.setMonth(
            today.getMonth() - 1
          );


          matchMonth =

            itemDate.getMonth() ===
            lastMonth.getMonth()

            &&

            itemDate.getFullYear() ===
            lastMonth.getFullYear();

        }


        return (
          matchSearch &&
          matchType &&
          matchMonth
        );

      }
    );

    this.currentPage = 1;

    this.updatePagination();

  }




  // DELETE TRANSACTION


  deleteTransaction(id: any) {


    /*
    
    DELETE API


    this.transactionService
    .deleteTransaction(id)
    .subscribe(()=>{

        this.getTransactions();

    })


    */


    console.log(
      "Delete Transaction",
      id
    );


  }
}
