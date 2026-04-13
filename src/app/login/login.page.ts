import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  /* IonLabel and IonItem removed to stop NG8113 warnings */
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
    CommonModule,
    FormsModule,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  showPassword = false;
  passwordType = 'password';
  passwordIcon = 'eye-off-outline';

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
    // This will take you to your dashboard greeting
    this.router.navigateByUrl('/home');
  }
}
