import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  heartOutline,
  heart,
  checkmarkCircleOutline,
  star,
  locationOutline,
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
  description?: string;
}

@Component({
  selector: 'app-material-details-modal',
  templateUrl: './material-details-modal.component.html',
  styleUrls: ['./material-details-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MaterialDetailsModalComponent {
  @Input() material!: Material;

  selectedRoom: string = 'room1';
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  rooms = [
    { value: 'room1', label: 'Room 1' },
    { value: 'room2', label: 'Room 2' },
    { value: 'room3', label: 'Room 3' },
    { value: 'room4', label: 'Room 4' },
    { value: 'room5', label: 'Room 5' },
  ];

  constructor(private modalController: ModalController) {
    addIcons({
      closeOutline,
      heartOutline,
      heart,
      checkmarkCircleOutline,
      star,
      locationOutline,
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  toggleFavorite() {
    this.material.isFavorite = !this.material.isFavorite;
    this.showToastMessage(
      this.material.isFavorite
        ? 'Added to favorites!'
        : 'Removed from favorites!',
      this.material.isFavorite ? 'heart' : 'heart-outline',
    );
  }

  applyMaterial() {
    const roomData = {
      material: this.material,
      room: this.selectedRoom,
      action: 'apply',
    };

    console.log('Applying material to room:', roomData);
    this.showToastMessage(
      `Applied ${this.material.name} to ${this.getRoomLabel(this.selectedRoom)}!`,
      'checkmark-circle-outline',
    );

    setTimeout(() => {
      this.modalController.dismiss({
        action: 'apply',
        material: this.material,
        room: this.selectedRoom,
      });
    }, 1500);
  }

  addToFavorites() {
    if (!this.material.isFavorite) {
      this.material.isFavorite = true;
      this.showToastMessage(
        `${this.material.name} added to favorites!`,
        'heart',
      );
    } else {
      this.showToastMessage(
        `${this.material.name} is already in favorites!`,
        'heart',
      );
    }
  }

  getDescription(): string {
    const descriptions: { [key: string]: string } = {
      flooring:
        'High-quality flooring material perfect for any room in your house. Durable, easy to clean, and comes with a 10-year warranty.',
      walls:
        'Premium wall covering that adds elegance to your space. Resistant to moisture and stains, easy to install.',
      furniture:
        'Modern and stylish furniture piece that complements any interior design. Made with premium materials.',
      fixtures:
        'Professional-grade fixture with modern design. Built to last with corrosion-resistant materials.',
    };

    if (this.material.description) {
      return this.material.description;
    }

    return (
      descriptions[this.material.category] ||
      'Premium quality material for your architectural projects.'
    );
  }

  private getRoomLabel(roomValue: string): string {
    const room = this.rooms.find((r) => r.value === roomValue);
    return room ? room.label : roomValue;
  }

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
