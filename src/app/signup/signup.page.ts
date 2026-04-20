import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class SignupPage {
  // Form fields
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;

  // Password visibility
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off-outline';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon =
      this.passwordIcon === 'eye-off-outline'
        ? 'eye-outline'
        : 'eye-off-outline';
  }

  toggleConfirmPassword() {
    this.confirmPasswordType =
      this.confirmPasswordType === 'password' ? 'text' : 'password';
    this.confirmPasswordIcon =
      this.confirmPasswordIcon === 'eye-off-outline'
        ? 'eye-outline'
        : 'eye-off-outline';
  }

  async signup() {
    // Validation
    if (
      !this.email ||
      !this.username ||
      !this.password ||
      !this.confirmPassword
    ) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match', 'warning');
      return;
    }

    if (!this.termsAccepted) {
      await this.showToast('Please accept the terms and conditions', 'warning');
      return;
    }

    // Attempt signup
    const result = this.authService.signup(
      this.email,
      this.username,
      this.password,
    );

    if (result.success) {
      await this.showToast(result.message, 'success');
      // Navigate to login page after successful signup
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
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
