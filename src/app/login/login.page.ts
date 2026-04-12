import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonCheckbox, 
  IonLabel 
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  logoFacebook, 
  logoInstagram, 
  logoLinkedin, 
  logoGoogle, 
  eyeOutline, 
  eyeOffOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonInput, IonButton, IonIcon, 
    IonCheckbox, IonLabel, CommonModule, FormsModule, RouterLink
  ]
})
export class LoginPage {
  showPassword = false;
  passwordType = 'password';
  passwordIcon = 'eye-off-outline';

  constructor() {
    addIcons({ 
      logoFacebook, logoInstagram, logoLinkedin, 
      logoGoogle, eyeOutline, eyeOffOutline 
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }
}