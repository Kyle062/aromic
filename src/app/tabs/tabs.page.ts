import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Add Router import
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  gridOutline,
  sparkles,
  folderOutline,
  personOutline,
  imageOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterModule],
})
export class TabsPage {
  constructor(private router: Router) {
    // Inject Router
    addIcons({
      imageOutline,
      homeOutline,
      gridOutline,
      folderOutline,
      personOutline,
      sparkles,
    });
  }

  navigateToPhotodesign() {
    this.router.navigate(['/photo-design']);
  }
}
  