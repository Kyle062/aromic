import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  briefcaseOutline,
  imagesOutline,
  starOutline,
  settingsOutline,
  headsetOutline,
  informationCircleOutline,
  logOutOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {
  userProfile = {
    name: 'Kylla Jen B.',
    designerId: '2045678901',
    email: 'kyllajen.b@gmail.com',
  };

  stats = { projects: 5, rooms: 28, saved: 12 };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({
      menuOutline,
      briefcaseOutline,
      imagesOutline,
      starOutline,
      settingsOutline,
      headsetOutline,
      informationCircleOutline,
      logOutOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfile.name = user.username;
      this.userProfile.email = user.email;
    }
  }

  openMenu() {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  async onLogout() {
    this.authService.logout();
    const toast = await this.toastController.create({
      message: 'Logged out successfully',
      duration: 1000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
    setTimeout(() => this.router.navigate(['/login']), 1000);
  }
}
