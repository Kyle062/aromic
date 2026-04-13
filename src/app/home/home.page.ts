import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonAvatar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonFooter,
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
  arrowForwardOutline, menuOutline, arrowForwardCircleOutline, addOutline, informationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonIcon,
    IonAvatar,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonFooter,
  ],
})
export class HomePage {
  constructor() {
    addIcons({menuOutline,addOutline,informationOutline,homeOutline,arrowForwardCircleOutline,layersOutline,apertureOutline,gridOutline,informationCircleOutline,addCircle,arrowForwardOutline,sparkles,folderOutline,personOutline,});
  }
}
