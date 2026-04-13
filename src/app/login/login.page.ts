import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Added Router here
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoGoogle,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonLabel,
    IonItem,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  showPassword = false;
  passwordType = 'password';
  passwordIcon = 'eye-off-outline';

  // Inject the Router in the constructor
  constructor(private router: Router) {
    addIcons({
      logoFacebook,
      logoInstagram,
      logoLinkedin,
      logoGoogle,
      eyeOutline,
      eyeOffOutline,
    });
  }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }

  login() {
    console.log('Login successful! Navigating to home...');
    this.router.navigateByUrl('/home');
  }
}
