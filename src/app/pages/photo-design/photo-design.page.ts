// src/app/pages/photo-design/photo-design.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  menuOutline,
  cameraOutline,
  imageOutline,
  sparklesOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-photo-design',
  templateUrl: './photo-design.page.html',
  styleUrls: ['./photo-design.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PhotoDesignPage {
  constructor() {
    addIcons({
      arrowBackOutline,
      menuOutline,
      cameraOutline,
      imageOutline,
      sparklesOutline,
    });
  }
}
