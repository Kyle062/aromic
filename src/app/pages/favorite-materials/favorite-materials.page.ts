import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  menuOutline,
  heart,
} from 'ionicons/icons';

@Component({
  selector: 'app-favorite-materials',
  templateUrl: './favorite-materials.page.html',
  styleUrls: ['./favorite-materials.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule],
})
export class FavoriteMaterialsPage implements OnInit {
  // Data array for the grid items
  favoriteMaterials = [
    {
      name: 'Olsen 110 Sofa',
      price: '$45.24',
      imgSrc: 'assets/placeholder-sofa.jpg', // Placeholder image
    },
    {
      name: 'Sculptural Floor Lamp',
      price: '$45.24',
      imgSrc: 'assets/placeholder-lamp.jpg', // Placeholder image
    },
    {
      name: 'Boho Fiber Curtains',
      price: '$45.24',
      imgSrc: 'assets/placeholder-curtains.jpg', // Placeholder image
    },
    {
      name: 'Hand Tuff Wool',
      price: '$45.24',
      imgSrc: 'assets/placeholder-wool.jpg', // Placeholder image
    },
    {
      name: 'Modern Bedside Table',
      price: '$45.24',
      imgSrc: 'assets/placeholder-table.jpg', // Placeholder image
    },
    {
      name: 'Ceramic Vase',
      price: '$45.24',
      imgSrc: 'assets/placeholder-vase.jpg', // Placeholder image
    },
  ];

  constructor() {
    // Register the icons used in the HTML
    addIcons({ arrowBackOutline, searchOutline, menuOutline, heart });
  }

  ngOnInit() {}
}
