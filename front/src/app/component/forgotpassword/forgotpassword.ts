import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Header, NgxSpinnerModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.scss',
})
export class Forgotpassword {
  forgotForm!: FormGroup;

  submitted = false;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private apiservice: ApiserviceService, private commonservice: CommonService, private spinner: NgxSpinnerService,private route:Router) { }


  ngOnInit(): void {
    const token = localStorage.getItem('traker_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,
      Validators.pattern(
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      )]]
    });

  }



  get f() {
    return this.forgotForm.controls;
  }



  submit(): void {
    this.spinner.show()
    this.submitted = true;
    if (this.forgotForm.invalid) {
      this.spinner.hide()
      return;
    }
    this.loading = true;
    const email = { email: this.forgotForm.value.email };
    console.log("Reset link request:", email);
    this.apiservice.postRequest('user/user_forgot', email).then((resdata: any) => {
      if (resdata.status) {
        this.spinner.hide()
        this.commonservice.openAlert("success", resdata.message)
        localStorage.setItem("traker_FORMAIL", this.forgotForm.value.email)
        sessionStorage.setItem("traker_FORMAIL", this.forgotForm.value.email)
        this.router.navigate(['resetpass'])
        this.loading = false;
      }
      else {
        this.commonservice.openAlert("error", resdata.message)
        this.spinner.hide()
        this.loading = false;

      }
    })

  }
}
