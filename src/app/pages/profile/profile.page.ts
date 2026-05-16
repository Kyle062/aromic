import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
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

interface ProfileData {
  name: string;
  username: string;
  email: string;
  phone: string;
  designerId: string;
  avatar: string;
}

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
    avatar: '../../assets/homepageImages/profile.png',
  };

  stats = { projects: 5, rooms: 28, saved: 12 };

  private readonly PROFILE_KEY = 'aromic_profile_data';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
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
    this.loadProfile();

    // ✅ Refresh profile every time user navigates back to this page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadProfile();
      });
  }

  // ✅ Load profile from localStorage (syncs with Settings)
  loadProfile() {
    const savedProfile = localStorage.getItem(this.PROFILE_KEY);
    if (savedProfile) {
      const profile: ProfileData = JSON.parse(savedProfile);
      this.userProfile.name = profile.name || this.userProfile.name;
      this.userProfile.email = profile.email || this.userProfile.email;
      this.userProfile.designerId = profile.designerId || this.userProfile.designerId;
      this.userProfile.avatar = profile.avatar || this.userProfile.avatar;
    } else {
      // Fallback to auth service
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userProfile.name = user.username;
        this.userProfile.email = user.email;
      }
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