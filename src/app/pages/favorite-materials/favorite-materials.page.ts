import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-favorite-materials',
  templateUrl: './favorite-materials.page.html',
  styleUrls: ['./favorite-materials.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FavoriteMaterialsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
