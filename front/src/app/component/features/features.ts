import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from "../footer/footer";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  imports: [CommonModule, Header, Footer,RouterLink],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {}
