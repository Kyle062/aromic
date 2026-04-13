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
} from 'ionicons/icons';

@Component({
  selector: 'app-materials-library',
  templateUrl: './materials-library.page.html',
  styleUrls: ['./materials-library.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MaterialsLibraryPage {
  constructor() {
    addIcons({ arrowBack, menuOutline, searchOutline, heartOutline });
  }
}
