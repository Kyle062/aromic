import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Brings in ion-input, ion-button, etc.
import { RouterModule } from '@angular/router'; // Required for routerLink="/login"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true, // Tells Angular this component manages its own dependencies
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    RouterModule
  ] 
})
export class SignupPage {
  
  // First Password Field
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';

  // Confirm Password Field
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off-outline';

  constructor() {}

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off-outline';
    }
  }

  toggleConfirmPassword() {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIcon = 'eye-outline';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIcon = 'eye-off-outline';
    }
  }
}