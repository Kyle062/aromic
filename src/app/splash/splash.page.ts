import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
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
export class SplashPage implements OnInit {
  constructor() {
    addIcons({ logoFacebook, logoInstagram, logoLinkedin });
  }

  ngOnInit() {
    // Clear any existing session when app starts
    localStorage.removeItem('aromic_current_user');
    console.log('Session cleared - user must login again');
  }
}