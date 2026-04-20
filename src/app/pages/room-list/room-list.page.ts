import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  createOutline,
  trashOutline,
  add,
} from 'ionicons/icons';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.page.html',
  styleUrls: ['./room-list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
  ],
})
export class RoomListPage implements OnInit {
  constructor() {
    // Register the icons so they render in standalone mode
    addIcons({ arrowBackOutline, createOutline, trashOutline, add });
  }

  ngOnInit() {}
}
