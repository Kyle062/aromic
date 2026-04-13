import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-materials-library',
  templateUrl: './materials-library.page.html',
  styleUrls: ['./materials-library.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MaterialsLibraryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
