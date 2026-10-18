import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Header } from "../header/header";
import { Router, RouterLink } from '@angular/router';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Header, RouterLink, NgxSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerForm!: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  submitted = false;

  loading = false;

  constructor(private fb: FormBuilder, private apiservice: ApiserviceService, private commonservice: CommonService, private route: Router, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    const token = localStorage.getItem('traker_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.fb.group({


      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required]
    },
      {
        validators: this.passwordMatch
      });

  }


  passwordMatch(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;

    const confirm = control.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };

  }


  get f() {
    return this.registerForm.controls;
  }


  register() {
    this.spinner.show()
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.spinner.hide()
      return;
    }
    this.loading = true;
    console.log(this.registerForm.value);
    this.apiservice.postRequest("user/user_register", this.registerForm.value).then((res: any) => {
      console.log("🚀 ~ Register ~ register ~ res:", res)
      this.spinner.hide()
      if (res.status) {
        this.commonservice.openAlert('success', res.message)
        this.route.navigate(['login'])
        localStorage.setItem("tracker_REGEMAIL", this.registerForm.value.email)
        sessionStorage.setItem("tracker_REGEMAIL", this.registerForm.value.email)
        this.registerForm.reset()
        this.loading = false;
      } else {
        this.commonservice.openAlert('error', res.message)
        this.loading = false;
      }

    })

  }
}
