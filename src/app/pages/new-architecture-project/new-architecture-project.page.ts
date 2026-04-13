import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-architecture-project',
  templateUrl: './new-architecture-project.page.html',
  styleUrls: ['./new-architecture-project.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewArchitectureProjectPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
