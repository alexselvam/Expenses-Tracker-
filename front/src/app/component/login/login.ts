import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from "../header/header";
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Header, RouterLink, NgxSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;

  submitted = false;

  loading = false;

  hidePassword = true;

  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private route: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('traker_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.spinner.show()
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.spinner.hide()
      return;

    }

    this.loading = true;
    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log(payload);

    this.apiservice.postRequest('user/user_login', payload).then((res: any) => {
      console.log("🚀 ~ Login ~ login ~ res:", res)
      if (res.status) {
        this.commonservice.openAlert('success', res.message);
        localStorage.setItem("tracker_LoginMail", this.loginForm.value.email);
        sessionStorage.setItem("tracker_LoginMail", this.loginForm.value.email);
        sessionStorage.setItem("traker_TOKEN", res.data);
        localStorage.setItem("traker_TOKEN", res.data);
        this.loginForm.reset();
        this.spinner.hide()
        this.loading = false;
        this.route.navigate(['dashboard'])

      } else {
        this.spinner.hide()
        this.loading = false;
        this.commonservice.openAlert('error', res.message);
      }

    })

  }
}
