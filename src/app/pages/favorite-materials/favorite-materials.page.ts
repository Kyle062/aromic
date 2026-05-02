import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  menuOutline,
  heart,
  heartOutline,
  closeCircle,
  arrowBack,
} from 'ionicons/icons';

interface Material {
  name: string;
  price: string;
  imgSrc: string;
}

@Component({
  selector: 'app-favorite-materials',
  templateUrl: './favorite-materials.page.html',
  styleUrls: ['./favorite-materials.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonBackButton, CommonModule, FormsModule],
})
export class FavoriteMaterialsPage implements OnInit {
  searchQuery: string = '';

  favoriteMaterials: Material[] = [
    {
      name: 'Olsen 110 Sofa',
      price: '$45.24',
      imgSrc: '../../../assets/favoritematerials/favorite1.png',
    },
    {
      name: 'Sculptural Floor Lamp',
      price: '$89.99',
      imgSrc: '../../../assets/favoritematerials/favorite2.png',
    },
    {
      name: 'Boho Fiber Curtains',
      price: '$34.50',
      imgSrc: '../../../assets/favoritematerials/favorite3.png',
    },
    {
      name: 'Hand Tuft Wool Rug',
      price: '$120.00',
      imgSrc: '../../../assets/favoritematerials/favorite4.png',
    },
    {
      name: 'Modern Bedside Table',
      price: '$67.89',
      imgSrc: '../../../assets/favoritematerials/favorite5.png',
    },
    {
      name: 'Ceramic Vase Set',
      price: '$28.99',
      imgSrc: '../../../assets/favoritematerials/favorite6.png',
    },
    {
      name: 'Oak Wood Flooring',
      price: '$45.24',
      imgSrc: '../../../assets/materials/materials1.png',
    },
    {
      name: 'Marble Wall Tile',
      price: '$89.99',
      imgSrc: '../../../assets/materials/materials2.png',
    },
  ];

  filteredMaterials: Material[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      searchOutline,
      menuOutline,
      heart,
      heartOutline,
      closeCircle,
      arrowBack,
    });
  }

  ngOnInit() {
    this.filteredMaterials = [...this.favoriteMaterials];
  }

  openMenu() {
    console.log('Menu opened');
  }

  // ✅ Search functionality
  filterMaterials() {
    if (!this.searchQuery.trim()) {
      this.filteredMaterials = [...this.favoriteMaterials];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredMaterials = this.favoriteMaterials.filter((m) =>
      m.name.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredMaterials = [...this.favoriteMaterials];
  }

  // ✅ Remove from favorites (unfavorite)
  async removeFavorite(item: Material, index: number) {
    const realIndex = this.favoriteMaterials.findIndex(
      (m) => m.name === item.name && m.imgSrc === item.imgSrc
    );

    if (realIndex > -1) {
      this.favoriteMaterials.splice(realIndex, 1);
      this.filterMaterials(); 

      const toast = await this.toastController.create({
        message: `"${item.name}" removed from favorites`,
        duration: 2000,
        position: 'bottom',
        color: 'dark',
      });
      await toast.present();
    }
  }
}
