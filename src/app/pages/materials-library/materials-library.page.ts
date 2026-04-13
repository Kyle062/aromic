import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  menuOutline,
  searchOutline,
  heartOutline,
  heart,
  closeCircle,
  star,
} from 'ionicons/icons';

interface Material {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  is3D: boolean;
  isNew: boolean;
  rating: number;
  isFavorite: boolean;
}

@Component({
  selector: 'app-materials-library',
  templateUrl: './materials-library.page.html',
  styleUrls: ['./materials-library.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MaterialsLibraryPage {
  searchQuery: string = '';
  activeFilter: string = 'all';
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  materials: Material[] = [
    {
      id: 1,
      name: 'Oak Wood Flooring',
      price: 45.24,
      image: '../../../assets/materials/materials1.png',
      category: 'flooring',
      is3D: true,
      isNew: false,
      rating: 4.8,
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Marble Wall Tile',
      price: 89.99,
      image: '../../../assets/materials/materials2.png',
      category: 'walls',
      is3D: true,
      isNew: true,
      rating: 4.9,
      isFavorite: false,
    },
    {
      id: 3,
      name: 'Modern Sofa Set',
      price: 1299.0,
      image: '../../../assets/materials/materials3.png',
      category: 'furniture',
      is3D: true,
      isNew: false,
      rating: 4.7,
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Brass Faucet',
      price: 199.5,
      image: '../../../assets/materials/materials4.png',
      category: 'fixtures',
      is3D: false,
      isNew: true,
      rating: 4.6,
      isFavorite: false,
    },
    {
      id: 5,
      name: 'Cherry Wood Floor',
      price: 52.75,
      image: '../../../assets/materials/materials5.png',
      category: 'flooring',
      is3D: true,
      isNew: false,
      rating: 4.5,
      isFavorite: false,
    },
    {
      id: 6,
      name: 'Ceramic Wall Tile',
      price: 34.99,
      image: '../../../assets/materials/materials6.png',
      category: 'walls',
      is3D: true,
      isNew: false,
      rating: 4.4,
      isFavorite: false,
    },
  ];

  filteredMaterials: Material[] = [];

  constructor() {
    addIcons({
      arrowBack,
      menuOutline,
      searchOutline,
      heartOutline,
      heart,
      closeCircle,
      star,
    });

    this.filteredMaterials = [...this.materials];
  }

  // Menu action
  openMenu() {
    this.showToastMessage('Menu opened', 'menu-outline');
  }

  // Search functionality
  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  // Filter materials by category
  filterMaterials(category: string) {
    this.activeFilter = category;
    this.showToastMessage(`Showing ${category} materials`, 'layers-outline');
    this.applyFilters();
  }

  // Apply both category and search filters
  private applyFilters() {
    let filtered = this.materials;

    // Apply category filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter((m) => m.category === this.activeFilter);
    }

    // Apply search filter
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query),
      );
    }

    this.filteredMaterials = filtered;
  }

  // Reset all filters
  resetFilters() {
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.filteredMaterials = [...this.materials];
    this.showToastMessage('Filters reset', 'refresh-outline');
  }

  // Toggle favorite
  toggleFavorite(material: Material, event: Event) {
    event.stopPropagation();
    material.isFavorite = !material.isFavorite;

    const message = material.isFavorite
      ? `${material.name} added to favorites`
      : `${material.name} removed from favorites`;

    this.showToastMessage(
      message,
      material.isFavorite ? 'heart' : 'heart-outline',
    );
  }

  // View material details
  viewMaterialDetails(material: Material) {
    this.showToastMessage(`Viewing ${material.name}`, 'eye-outline');
    
  }

  // Toast notification helper
  private showToastMessage(
    message: string,
    icon: string = 'checkmark-circle-outline',
  ) {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}
