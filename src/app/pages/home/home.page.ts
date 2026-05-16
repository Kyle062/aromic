import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircleOutline,
  addCircle,
  homeOutline,
  gridOutline,
  folderOutline,
  personOutline,
  sparkles,
  layersOutline,
  apertureOutline,
  arrowForwardOutline,
  menuOutline,
  arrowForwardCircleOutline,
  addOutline,
  informationOutline,
} from 'ionicons/icons';

interface RecentProject {
  name: string;
  rooms: number;
  floors: number;
  image: string;
  progress: number; // 0 to 100
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomePage {
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  // ✅ Recent projects data using project images
  recentProjects: RecentProject[] = [
    {
      name: 'Modern Villa',
      rooms: 3,
      floors: 2,
      image: '../../../assets/projects/project2.png',
      progress: 75,
    },
    {
      name: 'Beach House',
      rooms: 4,
      floors: 2,
      image: '../../../assets/projects/project3.png',
      progress: 45,
    },
    {
      name: 'Mountain Cabin',
      rooms: 5,
      floors: 3,
      image: '../../../assets/projects/project4.png',
      progress: 100,
    },
   
  ];

  constructor(private router: Router) {
    addIcons({
      menuOutline,
      addOutline,
      informationOutline,
      homeOutline,
      arrowForwardCircleOutline,
      layersOutline,
      apertureOutline,
      gridOutline,
      informationCircleOutline,
      addCircle,
      arrowForwardOutline,
      sparkles,
      folderOutline,
      personOutline,
    });
  }

  navigateToPhotoDesign() {
    this.showToastMessage('Opening Photo Design', 'aperture-outline');
    this.router.navigate(['/photo-design']);
  }

  // ✅ Navigate to a specific project
  continueProject(project: RecentProject) {
    console.log('Continue project:', project.name);
    this.showToastMessage(`Opening ${project.name}`, 'folder-outline');
    this.router.navigate(['/projects1']);
  }

  // ✅ Get progress status text
  getProgressStatus(progress: number): string {
    if (progress === 100) return 'Completed';
    if (progress >= 50) return 'In Progress';
    return 'Just Started';
  }

  // ✅ Get status class for styling
  getStatusClass(progress: number): string {
    if (progress === 100) return 'completed';
    if (progress >= 50) return 'in-progress';
    return 'started';
  }

  private showToastMessage(message: string, icon: string) {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}