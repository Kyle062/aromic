import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  menuOutline,
  headsetOutline,
  helpCircleOutline,
  chatbubblesOutline,
  bookOutline,
  bugOutline,
  mailOutline,
  callOutline,
  timeOutline,
  locationOutline,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoTwitter,
  closeOutline,
  arrowBack,
} from 'ionicons/icons';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.page.html',
  styleUrls: ['./help-support.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonBackButton, CommonModule, FormsModule],
})
export class HelpSupportPage implements OnInit {
  // Modal states
  showFaqModal: boolean = false;
  showContactModal: boolean = false;
  showGuideModal: boolean = false;
  showReportModal: boolean = false;

  bugReport = {
    title: '',
    description: '',
  };

  constructor(private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      menuOutline,
      headsetOutline,
      helpCircleOutline,
      chatbubblesOutline,
      bookOutline,
      bugOutline,
      mailOutline,
      callOutline,
      timeOutline,
      locationOutline,
      logoFacebook,
      logoInstagram,
      logoLinkedin,
      logoTwitter,
      closeOutline,
      arrowBack,
    });
  }

  ngOnInit() {}

  openMenu() {}

  openFaqModal() { this.showFaqModal = true; }
  closeFaqModal() { this.showFaqModal = false; }

  openContactModal() { this.showContactModal = true; }
  closeContactModal() { this.showContactModal = false; }

  openGuideModal() { this.showGuideModal = true; }
  closeGuideModal() { this.showGuideModal = false; }

  openReportModal() {
    this.bugReport = { title: '', description: '' };
    this.showReportModal = true;
  }
  closeReportModal() { this.showReportModal = false; }

  async submitBugReport() {
    if (!this.bugReport.title.trim()) {
      const toast = await this.toastController.create({
        message: 'Please enter a title for the issue',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.closeReportModal();
    const toast = await this.toastController.create({
      message: 'Bug report submitted. Thank you!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}