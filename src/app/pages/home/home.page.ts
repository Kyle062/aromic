import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Added Router
import {
  IonContent,
  IonIcon,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircleOutline,
  addCircle,
  homeOutline,
  gridOutline,
  folderOutline,
  personOutline,
  sparkles,
  layersOutline,
  apertureOutline,
  arrowForwardOutline,
  menuOutline,
  arrowForwardCircleOutline,
  addOutline,
  informationOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomePage {
  // Toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  constructor(private router: Router) {
    // Inject Router here
    addIcons({
      menuOutline,
      addOutline,
      informationOutline,
      homeOutline,
      arrowForwardCircleOutline,
      layersOutline,
      apertureOutline,
      gridOutline,
      informationCircleOutline,
      addCircle,
      arrowForwardOutline,
      sparkles,
      folderOutline,
      personOutline,
    });
  }

  navigateToPhotoDesign() {
    this.showToastMessage('Opening Photo Design', 'aperture-outline');
    this.router.navigate(['/photo-design']);
  }

  // Helper method for the toast feedback
  private showToastMessage(message: string, icon: string) {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}
