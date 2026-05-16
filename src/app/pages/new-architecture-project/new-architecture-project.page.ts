import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
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
  addCircle,
  folderOutline,
  personOutline,
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
  allRoomsData: any[] = [];

  projectData: ProjectData = {
    projectName: '',
    width: null,
    length: null,
    floor: '1',
    notes: '',
  };

  constructor(private navCtrl: NavController) {
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
      addCircle,
      folderOutline,
      personOutline,
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

  async addAnotherRoom() {
    const roomData = { ...this.projectData, roomNumber: this.currentRoom };
    this.allRoomsData.push(roomData);
    console.log('Room saved:', roomData);

    this.currentRoom++;
    this.showToastMessage('Successfully added another room!');
    this.clearForm();
  }

  async generate3DHouse() {
    const finalRoomData = { ...this.projectData, roomNumber: this.currentRoom };
    this.allRoomsData.push(finalRoomData);
    console.log('All rooms saved:', this.allRoomsData);

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

    setTimeout(() => {
      this.navCtrl.navigateForward('/room-list', {
        queryParams: { houseData: JSON.stringify(houseData) },
      });
    }, 500);
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

  private clearForm() {
    this.projectData = {
      projectName: '',
      width: null,
      length: null,
      floor: this.projectData.floor,
      notes: '',
    };
  }
}