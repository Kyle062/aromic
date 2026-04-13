import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  menuOutline,
  cameraOutline,
  imageOutline,
  sparklesOutline,
  arrowForwardOutline,
  camera,
  images,
  aperture,
} from 'ionicons/icons';

interface Design {
  id: number;
  name: string;
  thumbnail: string;
  date: Date;
}

@Component({
  selector: 'app-photo-design',
  templateUrl: './photo-design.page.html',
  styleUrls: ['./photo-design.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PhotoDesignPage {
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  recentDesigns: Design[] = [
    {
      id: 1,
      name: 'Living Room',
      thumbnail: '../../../assets/photodesign/photodesign1.png',
      date: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Kitchen',
      thumbnail: '../../../assets/photodesign/photodesign3.png',
      date: new Date('2024-01-14'),
    },
    {
      id: 3,
      name: 'Bedroom',
      thumbnail: '../../../assets/photodesign/photodesign1.png',
      date: new Date('2024-01-13'),
    },
    {
      id: 4,
      name: 'Bathroom',
      thumbnail: '../../../assets/photodesign/photodesign3.png',
      date: new Date('2024-01-12'),
    },
  ];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
  ) {
    addIcons({
      arrowBackOutline,
      menuOutline,
      cameraOutline,
      imageOutline,
      sparklesOutline,
      arrowForwardOutline,
      camera,
      images,
      aperture,
    });
  }

  // Handle back navigation with confirmation if needed
  handleBackNavigation() {
    this.showToastMessage('Returning to home', 'arrow-back-outline');
    this.navCtrl.navigateBack('/home');
  }

  // Open menu
  openMenu() {
    this.showToastMessage('Menu opened', 'menu-outline');
    // You can add menu options here
    this.presentMenuOptions();
  }

  // Open camera to take photo
  openCamera() {
    this.showToastMessage('Opening camera...', 'camera-outline');
    // In a real app, you would use Capacitor Camera plugin
    // this.camera.getPhoto().then(...)

    setTimeout(() => {
      this.showToastMessage('Camera ready', 'camera');
    }, 500);
  }

  // Open AR Mode
  openARMode() {
    this.showToastMessage('Launching AR Mode', 'aperture-outline');
    // Navigate to AR view or open AR functionality
    setTimeout(() => {
      this.showToastMessage('AR Mode activated', 'sparkles-outline');
    }, 800);
  }

  // Open gallery to select image
  openGallery() {
    this.showToastMessage('Opening gallery...', 'images-outline');
    // In a real app, you would use Capacitor Camera plugin for gallery
    // this.camera.pickImages().then(...)

    setTimeout(() => {
      this.showToastMessage('Select an image', 'image-outline');
    }, 500);
  }

  // Continue to design editor
  continueToDesign() {
    this.showToastMessage('Loading design editor...', 'brush-outline');
    // Navigate to design editor page
    setTimeout(() => {
      // this.navCtrl.navigateForward('/design-editor');
      this.showToastMessage('Design editor ready', 'checkmark-circle-outline');
    }, 1000);
  }

  // Open a recent design
  openDesign(design: Design) {
    this.showToastMessage(`Opening ${design.name}`, 'folder-open-outline');
    // Navigate to design details or editor with the selected design
    // this.navCtrl.navigateForward(['/design-editor', design.id]);
  }

  // Present menu options
  async presentMenuOptions() {
    const alert = await this.alertController.create({
      header: 'Photo Design Menu',
      buttons: [
        {
          text: 'My Projects',
          handler: () => {
            this.showToastMessage('Opening projects', 'folder-outline');
          },
        },
        {
          text: 'Templates',
          handler: () => {
            this.showToastMessage('Opening templates', 'layers-outline');
          },
        },
        {
          text: 'Settings',
          handler: () => {
            this.showToastMessage('Opening settings', 'settings-outline');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  // Show camera options (take photo or choose from gallery)
  async showCameraOptions() {
    const alert = await this.alertController.create({
      header: 'Add Photo',
      message: 'Choose an option',
      buttons: [
        {
          text: 'Take Photo',
          handler: () => {
            this.openCamera();
          },
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.openGallery();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  // Save design
  saveDesign(designName: string) {
    const newDesign: Design = {
      id: this.recentDesigns.length + 1,
      name: designName,
      thumbnail: '../../../assets/photodesign/photodesign1.png',
      date: new Date(),
    };

    this.recentDesigns.unshift(newDesign);
    this.showToastMessage(`${designName} saved successfully`, 'save-outline');
  }

  // Delete design
  deleteDesign(design: Design, event: Event) {
    event.stopPropagation();

    const index = this.recentDesigns.findIndex((d) => d.id === design.id);
    if (index > -1) {
      this.recentDesigns.splice(index, 1);
      this.showToastMessage(`${design.name} deleted`, 'trash-outline');
    }
  }

  // Export design
  exportDesign(design: Design) {
    this.showToastMessage(`Exporting ${design.name}...`, 'download-outline');
    setTimeout(() => {
      this.showToastMessage('Export complete', 'checkmark-circle-outline');
    }, 1500);
  }

  // Share design
  shareDesign(design: Design) {
    this.showToastMessage(`Sharing ${design.name}...`, 'share-outline');
    // Implement share functionality
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
