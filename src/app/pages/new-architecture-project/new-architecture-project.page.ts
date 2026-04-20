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

  // ADD THIS MISSING ARRAY DECLARATION:
  allRoomsData: any[] = [];

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
    // Save current room data
    const roomData = { ...this.projectData, roomNumber: this.currentRoom };
    this.allRoomsData.push(roomData); // ADD THIS LINE to save the room
    console.log('Room saved:', roomData);
    console.log('All rooms so far:', this.allRoomsData);

    // Increment room counter
    this.currentRoom++;

    // Show success message
    this.showToastMessage('Successfully added another room!');

    // Clear form for next room
    this.clearForm();
  }

  async generate3DHouse() {
    // Save final room data
    const finalRoomData = { ...this.projectData, roomNumber: this.currentRoom };
    this.allRoomsData.push(finalRoomData);
    console.log('All rooms saved:', this.allRoomsData);

    // Prepare data to send to 3D view
    const houseData = {
      projectName: this.projectData.projectName || 'Untitled Project',
      totalRooms: this.currentRoom,
      rooms: this.allRoomsData,
      dimensions: {
        width: this.projectData.width,
        length: this.projectData.length,
      },
      floor: this.projectData.floor,
      notes: this.projectData.notes,
    };

   
    // Navigate to 3D house view page
    setTimeout(() => {
      this.navCtrl.navigateForward('/room-list', {
        queryParams: { houseData: JSON.stringify(houseData) },
      });
    }, 500);
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
    // Clear all form fields except floor
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
    this.allRoomsData = []; // Also clear the rooms array
    this.clearForm();
    this.projectData.floor = '1';
  }

  // Optional: Method to get all rooms data
  getAllRooms() {
    return {
      totalRooms: this.currentRoom,
      maxRooms: this.totalRooms,
      rooms: this.allRoomsData,
    };
  }
}
