import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from "../header/header";
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, Header,Sidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {

   user = {
    name: 'Alex',
    email: 'alex@gmail.com',
    phone: '+91 9876543210',
    currency: 'INR',
    theme: 'Light',
    emailNotification: true,
    pushNotification: false
  };

  saveSettings() {
    console.log('Settings Saved', this.user);

    /*
      POST /api/v1/settings/update

      {
        name,
        email,
        phone,
        currency,
        theme,
        emailNotification,
        pushNotification
      }
    */
  }
}
