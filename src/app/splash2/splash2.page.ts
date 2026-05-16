import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash2',
  templateUrl: './splash2.page.html',
  styleUrls: ['./splash2.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class Splash2Page implements OnInit, OnDestroy {
  private timeoutId: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // ✅ Check if this splash is shown after login
    const isLoginSuccess = sessionStorage.getItem('login_success');
    const loginUser = sessionStorage.getItem('login_user');

    const MIN_DISPLAY_TIME = 3000;

    this.timeoutId = setTimeout(() => {
      const container = document.querySelector('.splash-container');
      if (container) {
        container.classList.add('exit-animation');
      }

      setTimeout(() => {
        // ✅ If coming from login, go to home. Otherwise go to main splash
        if (isLoginSuccess === 'true') {
          // Clear the flag
          sessionStorage.removeItem('login_success');
          sessionStorage.removeItem('login_user');
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/splash']);
        }
      }, 200);
    }, MIN_DISPLAY_TIME);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}