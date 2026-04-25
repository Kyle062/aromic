import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonIcon,
  IonBackButton,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // ✅ Fixed path
import { addIcons } from 'ionicons';
import { 
  menuOutline,
  briefcaseOutline,
  bookmarkOutline,
  imagesOutline,
  starOutline,
  settingsOutline,
  headsetOutline,
  informationCircleOutline,
  logOutOutline,
  chevronForwardOutline,
  arrowBack
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonBackButton,
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit {
  userProfile = {
    name: 'Kylla Jen B.',
    designerId: '2045678901',
    email: 'kyllajen.b@gmail.com',
    avatar: 'assets/profile-avatar.jpg'
  };

  stats = {
    projects: 5,
    rooms: 28,
    saved: 12
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({
      menuOutline,
      briefcaseOutline,
      bookmarkOutline,
      imagesOutline,
      starOutline,
      settingsOutline,
      headsetOutline,
      informationCircleOutline,
      logOutOutline,
      chevronForwardOutline,
      arrowBack
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile.name = currentUser.username;
      this.userProfile.email = currentUser.email;
    }
  }

  openMenu() {
    console.log('Menu opened');
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  async onLogout() {
    this.authService.logout();
    
    const toast = await this.toastController.create({
      message: 'Logged out successfully',
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message} - Coming Soon`,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}