import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Header, NgxSpinnerModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {


  resetForm!: FormGroup;

  submitted = false;

  loading = false;

  hidePassword = true;

  hideConfirm = true;
  ForgotEmail: string | null = localStorage.getItem('traker_FORMAIL') ?? sessionStorage.getItem('traker_FORMAIL');


  constructor(private fb: FormBuilder, private apiservice: ApiserviceService, private commonservice: CommonService, private route: Router, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {

    const token = localStorage.getItem('traker_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],

        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

  }

  get f() {
    return this.resetForm.controls;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {

      control.get('confirmPassword')?.setErrors({
        passwordMismatch: true
      });

      return {
        passwordMismatch: true
      };

    }

    return null;

  }

  resetPassword() {

    this.submitted = true;

    if (this.resetForm.invalid) {
      this.spinner.hide()
      return;

    }

    this.loading = true;

    const payload = {
      email: this.ForgotEmail,
      password: this.resetForm.value.password,
      confirmPassword: this.resetForm.value.confirmPassword

    };

    console.log(payload);

    this.apiservice.postRequest('user/forgot_update', payload).then((suc: any) => {
      if (suc.status) {
        this.commonservice.openAlert('success', suc.message);
        localStorage.setItem("tracker_REGEMAIL", this.resetForm.value.email);
        sessionStorage.setItem("tracker_REGEMAIL", this.resetForm.value.email);
        sessionStorage.setItem("traker_TOKEN", suc.data);
        localStorage.setItem("traker_TOKEN", suc.data);
        this.route.navigate(['login']);
        this.resetForm.reset();
        this.spinner.hide()
        this.loading = false;
      } else {
        this.spinner.hide()
        this.loading = false;
        this.commonservice.openAlert('error', suc.message);
      }
    });
  }


}
