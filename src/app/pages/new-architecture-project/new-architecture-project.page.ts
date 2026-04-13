import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  menuOutline,
  homeOutline,
  pencilOutline,
  layersOutline,
  readerOutline,
  businessOutline,
  cubeOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

interface ProjectData {
  projectName: string;
  width: number | null;
  length: number | null;
  floor: string;
  notes: string;
}

@Component({
  selector: 'app-new-architecture-project',
  templateUrl: './new-architecture-project.page.html',
  styleUrls: ['./new-architecture-project.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NewArchitectureProjectPage {
  currentRoom: number = 1;
  totalRooms: number = 25;
  showToast: boolean = false;
  toastMessage: string = '';

  projectData: ProjectData = {
    projectName: '',
    width: null,
    length: null,
    floor: '1',
    notes: '',
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
  ) {
    addIcons({
      arrowBack,
      menuOutline,
      homeOutline,
      pencilOutline,
      layersOutline,
      readerOutline,
      businessOutline,
      cubeOutline,
      checkmarkCircleOutline,
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

  async addAnotherRoom() {
    // Save current room data (you can add logic to store this in an array)
    const roomData = { ...this.projectData, roomNumber: this.currentRoom };
    console.log('Room saved:', roomData);

    // Increment room counter
    this.currentRoom++;

    // Show success message
    this.showToastMessage('Successfully added another room!');

    // Clear form for next room (optional - you can keep or clear the data)
    this.clearForm();
  }

  async generate3DHouse() {
    // Save final room data
    const finalRoomData = { ...this.projectData, roomNumber: this.currentRoom };
    console.log('Final room saved:', finalRoomData);

    // Show success message
    this.showToastMessage('Successfully generated 3D house!');

    // You can add navigation to 3D view here
    setTimeout(() => {
      // Navigate to 3D view page (adjust path as needed)
      // this.navCtrl.navigateForward('/3d-view');
      console.log('Navigating to 3D view...');
    }, 1500);
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    // Hide toast after 2 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

  private clearForm() {
    // Clear all form fields except floor (keep as default 1)
    this.projectData = {
      projectName: '',
      width: null,
      length: null,
      floor: this.projectData.floor, // Keep the selected floor
      notes: '',
    };
  }

  // Optional: Method to reset the entire project
  resetProject() {
    this.currentRoom = 1;
    this.clearForm();
    this.projectData.floor = '1';
  }

  // Optional: Method to get all rooms data (implement storage logic)
  getAllRooms() {
    // This is where you'd implement logic to retrieve all saved rooms
    // For now, just returning example structure
    return {
      totalRooms: this.currentRoom,
      maxRooms: this.totalRooms,
    };
  }
}
