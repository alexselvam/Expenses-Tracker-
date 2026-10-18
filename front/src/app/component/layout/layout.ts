import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, Header, Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {


  // Mobile sidebar toggle
  sidebarOpen: boolean = false;

  // Open / Close Sidebar
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Close Sidebar
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

}
