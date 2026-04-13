import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
/* Keep only the components actually used in your HTML */
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
    /* Cleaned up list to remove warnings */
    IonContent,
    IonIcon,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomePage {
  constructor() {
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
}
