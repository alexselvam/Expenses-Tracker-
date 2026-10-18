import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { RouterLink } from "@angular/router";
import { Header } from "../header/header";

@Component({
  selector: 'app-home',
  imports: [Footer, RouterLink, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  islogin: any = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;

  constructor() {
    if (!this.islogin) {
    }
  }
}
