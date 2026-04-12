import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone'; // Import only what you actually use
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons'; // Required to make icons work in standalone
import { logoFacebook, logoInstagram, logoLinkedin } from 'ionicons/icons'; 

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton, 
    IonIcon, 
    CommonModule, 
    FormsModule, 
    RouterLink
  ]
})
export class SplashPage {
  constructor() {
    // This registers the icons so the app can find them
    addIcons({ logoFacebook, logoInstagram, logoLinkedin });
  }
}