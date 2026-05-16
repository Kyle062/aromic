import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  menuOutline,
  bulbOutline,
  compassOutline,
  eyeOutline,
  cubeOutline,
  layersOutline,
  cameraOutline,
  homeOutline,
  saveOutline,
  peopleOutline,
  logoInstagram,
  logoFacebook,
  mailOutline,
  globeOutline,
  arrowBack,
} from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonBackButton, CommonModule, FormsModule],
})
export class AboutPage implements OnInit {
  constructor() {
    addIcons({
      arrowBackOutline,
      menuOutline,
      bulbOutline,
      compassOutline,
      eyeOutline,
      cubeOutline,
      layersOutline,
      cameraOutline,
      homeOutline,
      saveOutline,
      peopleOutline,
      logoInstagram,
      logoFacebook,
      mailOutline,
      globeOutline,
      arrowBack,
    });
  }

  ngOnInit() {}

  openMenu() {
    console.log('Menu opened');
  }
}