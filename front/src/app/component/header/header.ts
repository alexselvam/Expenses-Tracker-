import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  islogin: any
  constructor(private rtr: Router, private apiservice: ApiserviceService) {

  }
  ngOnInit() {
    this.islogin = localStorage.getItem('traker_TOKEN') ?? sessionStorage.getItem('traker_TOKEN') ?? null;
   
  }


  logout() {
    this.apiservice.logout(false)
  }
}
