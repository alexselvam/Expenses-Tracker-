import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,
    RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() sidebarOpen = false;

  constructor(private apiservice: ApiserviceService) {

  }

  logout() {
    this.apiservice.logout(false)
  }
}
