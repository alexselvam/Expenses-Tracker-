import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-about',
  imports: [CommonModule,RouterModule,Header],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
