import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;

  constructor() {
    if (!this.islogin) {
    }
  }
}
