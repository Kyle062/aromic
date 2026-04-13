import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular'; // Added NavController
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
} from 'ionicons/icons';

@Component({
  selector: 'app-new-architecture-project',
  templateUrl: './new-architecture-project.page.html',
  styleUrls: ['./new-architecture-project.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NewArchitectureProjectPage {
  // Inject NavController in the constructor
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
    });
  }

  // Create the back function
  goBack() {
    this.navCtrl.navigateBack('/home'); // Adjust the path as needed
  }
}
