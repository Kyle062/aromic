import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon 
} from '@ionic/angular/standalone';
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
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon]
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

  constructor() {
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
      chevronForwardOutline
    });
  }

  ngOnInit() {
  }

  onMenuItemClick(item: string) {
    console.log('Clicked:', item);
    // Add navigation or action logic here
  }

  onLogout() {
    console.log('Logout clicked');
    // Add logout logic here
  }
}