import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  createOutline,
  trashOutline,
  menuOutline,
  closeCircle,
  warningOutline,
  imagesOutline,
  arrowBack,
} from 'ionicons/icons';

interface Design {
  title: string;
  details: string;
  category: string;
  imgSrc: string;
  rooms: number;
  floors: number;
}

@Component({
  selector: 'app-my-photo-design',
  templateUrl: './my-photo-design.page.html',
  styleUrls: ['./my-photo-design.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonBackButton, CommonModule, FormsModule],
})
export class MyPhotoDesignPage implements OnInit {
  searchQuery: string = '';
  showEditModal: boolean = false;
  showDeleteConfirm: boolean = false;
  deleteTarget: Design | null = null;
  deleteIndex: number = -1;
  editIndex: number = -1;

  editForm = {
    title: '',
    rooms: 1,
    floors: 1,
    category: 'Architecture',
  };

  designs: Design[] = [
    {
      title: 'Minimalist Hacience Home',
      details: '2 rooms • 1 floors • 2 hours ago',
      category: 'Architecture',
      imgSrc: '../../../assets/photodesign2/photodesign1.png',
      rooms: 2,
      floors: 1,
    },
    {
      title: 'Chic Marble Kitchen',
      details: '1 room • 1 floor • 5 days ago',
      category: 'Interior',
      imgSrc: '../../../assets/photodesign2/photodesign2.png',
      rooms: 1,
      floors: 1,
    },
    {
      title: 'Boho Balcony Redesign',
      details: '1 room • 1 floor • 1 week ago',
      category: 'Interior',
      imgSrc: '../../../assets/photodesign2/photodesign3.png',
      rooms: 1,
      floors: 1,
    },
  ];

  filteredDesigns: Design[] = [];

  constructor(private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      searchOutline,
      createOutline,
      trashOutline,
      menuOutline,
      closeCircle,
      warningOutline,
      imagesOutline,
      arrowBack,
    });
  }

  ngOnInit() {
    this.filteredDesigns = [...this.designs];
  }

  openMenu() {
    console.log('Menu opened');
  }

  // ✅ Search functionality
  filterDesigns() {
    if (!this.searchQuery.trim()) {
      this.filteredDesigns = [...this.designs];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredDesigns = this.designs.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredDesigns = [...this.designs];
  }

  // ✅ Edit functionality with modal
  editDesign(design: Design, index: number) {
    this.editIndex = index;
    this.editForm = {
      title: design.title,
      rooms: design.rooms,
      floors: design.floors,
      category: design.category,
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  async saveEdit() {
    if (this.editIndex >= 0 && this.editIndex < this.designs.length) {
      this.designs[this.editIndex] = {
        ...this.designs[this.editIndex],
        title: this.editForm.title,
        rooms: this.editForm.rooms,
        floors: this.editForm.floors,
        category: this.editForm.category,
        details: `${this.editForm.rooms} rooms • ${this.editForm.floors} floors • Just now`,
      };
      this.filterDesigns();
      this.showEditModal = false;

      const toast = await this.toastController.create({
        message: 'Design updated successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    }
  }

  // ✅ Delete functionality with confirmation
  deleteDesign(design: Design, index: number) {
    this.deleteTarget = design;
    this.deleteIndex = index;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
    this.deleteIndex = -1;
  }

  async confirmDelete() {
    if (this.deleteIndex >= 0 && this.deleteIndex < this.designs.length) {
      const name = this.designs[this.deleteIndex].title;
      this.designs.splice(this.deleteIndex, 1);
      this.filterDesigns();
      this.closeDeleteConfirm();

      const toast = await this.toastController.create({
        message: `"${name}" deleted`,
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
