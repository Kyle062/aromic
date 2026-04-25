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
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
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
  identifier: string = ''; // Email or username
  password: string = '';
  rememberMe: boolean = false;

  showPassword = false;
  passwordType = 'password';
  passwordIcon = 'eye-off-outline';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
  ) {
    addIcons({
      logoFacebook,
      logoInstagram,
      logoLinkedin,
      logoGoogle,
      eyeOutline,
      eyeOffOutline,
    });
  }

  ngOnInit() {
    
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }

  async login() {
    if (!this.identifier || !this.password) {
      await this.showToast(
        'Please enter email/username and password',
        'warning',
      );
      return;
    }

    const result = this.authService.login(this.identifier, this.password);

    if (result.success) {
      await this.showToast(
        `Welcome back, ${result.user?.username}!`,
        'success',
      );

      // Navigate to home page
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    } else {
      await this.showToast(result.message, 'danger');
    }
  }

  private async showToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color,
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}
