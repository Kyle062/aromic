import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  createOutline,
  trashOutline,
  menuOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-my-photo-design',
  templateUrl: './my-photo-design.page.html',
  styleUrls: ['./my-photo-design.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule],
})
export class MyPhotoDesignPage implements OnInit {
  // Data array to populate the design cards dynamically
  designs = [
    {
      title: 'Minimalist Hacience Home',
      details: '2 rooms • 1 floors • 2 hours ago',
      category: 'Architecture',
      imgSrc: 'assets/placeholder-home.jpg', // Placeholder for card image
    },
    {
      title: 'Chic Marble Kitchen',
      details: '1 room • 1 floor • 5 days ago',
      category: 'Interior',
      imgSrc: 'assets/placeholder-kitchen.jpg', // Placeholder for card image
    },
    {
      title: 'Boho Balcony Redesign',
      details: '1 room • 1 floor • 1 week ago',
      category: 'Interior',
      imgSrc: 'assets/placeholder-balcony.jpg', // Placeholder for card image
    },
  ];

  constructor() {
    // Register the icons used in the template
    addIcons({
      arrowBackOutline,
      searchOutline,
      createOutline,
      trashOutline,
      menuOutline,
    });
  }

  ngOnInit() {}
}
