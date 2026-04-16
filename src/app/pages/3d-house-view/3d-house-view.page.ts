import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowUndoOutline,
  refreshOutline,
  saveOutline,
  gridOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-three-d-house-view',
  templateUrl: './3d-house-view.page.html',
  styleUrls: ['./3d-house-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ThreeDHouseViewPage implements OnInit {
  houseData: any = null;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) {
    addIcons({
      arrowBackOutline,
      arrowUndoOutline,
      refreshOutline,
      saveOutline,
      gridOutline,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['houseData']) {
        this.houseData = JSON.parse(params['houseData']);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home');
  }
}
