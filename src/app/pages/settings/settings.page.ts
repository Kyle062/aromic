import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonBackButton,
  IonToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  menuOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  moonOutline,
  notificationsOutline,
  languageOutline,
  resizeOutline,
  gridOutline,
  colorPaletteOutline,
  eyeOutline,
  trashOutline,
  downloadOutline,
  cloudUploadOutline,
  informationCircleOutline,
  codeSlashOutline,
  documentTextOutline,
  shieldCheckmarkOutline,
  chevronForwardOutline,
  arrowBack,
  warningOutline,
  checkmarkCircle,
  closeOutline,
  cameraOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonBackButton,
    IonToggle,
    CommonModule,
    FormsModule,
  ],
})
export class SettingsPage implements OnInit {
  // Toggle states
  darkMode: boolean = false;
  notifications: boolean = true;

  // Select states
  selectedLanguage: string = 'English';
  selectedUnit: string = 'Meters (m)';
  selectedView: string = '2D Floor Plan';
  selectedTheme: string = 'Warm Cream';
  selectedQuality: string = 'High';

  // Profile data
  profileData = {
    name: 'Kylla Jen B.',
    username: 'kyllajen',
    email: 'kyllajen.b@gmail.com',
    phone: '+63 912 345 6789',
    designerId: '2045678901',
    avatar: '../../assets/homepageImages/profile.png',
  };

  // Edit form
  editForm = {
    name: '',
    username: '',
    email: '',
    phone: '',
    designerId: '',
  };

  // Modal states
  showEditProfileModal: boolean = false;
  showInfoModal: boolean = false;
  showSelectModal: boolean = false;
  showContentModal: boolean = false;
  showConfirmModal: boolean = false;

  modalTitle: string = '';
  modalMessage: string = '';
  modalIcon: string = '';
  modalContent: string = '';
  modalOptions: string[] = [];
  currentSelectKey: string = '';

  // Content for modals
  termsContent: string = `TERMS OF SERVICE\n\nLast updated: May 2026\n\n1. Acceptance of Terms\nBy using Aromic, you agree to these terms of service.\n\n2. User Accounts\nYou are responsible for maintaining the confidentiality of your account credentials.\n\n3. Intellectual Property\nAll designs created using Aromic remain your intellectual property.\n\n4. Service Usage\nAromic is designed for architecture and interior design purposes. Any misuse is prohibited.\n\n5. Limitation of Liability\nAromic is provided "as is" without warranties of any kind.\n\n6. Changes to Terms\nWe reserve the right to update these terms at any time.`;

  privacyContent: string = `PRIVACY POLICY\n\nLast updated: May 2026\n\n1. Information Collection\nWe collect minimal personal information necessary to provide our services.\n\n2. Data Usage\nYour data is used solely for improving your design experience.\n\n3. Data Storage\nAll project data is stored securely on your device and optionally in the cloud.\n\n4. Third-Party Sharing\nWe do not sell or share your personal information with third parties.\n\n5. Cookies\nWe use essential cookies for app functionality only.\n\n6. Your Rights\nYou can request deletion of your data at any time.\n\n7. Contact\nFor privacy concerns, contact us at privacy@aromic.com`;

  constructor(
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({
      arrowBackOutline,
      menuOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      moonOutline,
      notificationsOutline,
      languageOutline,
      resizeOutline,
      gridOutline,
      colorPaletteOutline,
      eyeOutline,
      trashOutline,
      downloadOutline,
      cloudUploadOutline,
      informationCircleOutline,
      codeSlashOutline,
      documentTextOutline,
      shieldCheckmarkOutline,
      chevronForwardOutline,
      arrowBack,
      warningOutline,
      checkmarkCircle,
      closeOutline,
      cameraOutline,
    });
  }

  ngOnInit() {}

  openMenu() {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  // ✅ Edit Profile Modal
  openEditProfileModal() {
    this.editForm = {
      name: this.profileData.name,
      username: this.profileData.username,
      email: this.profileData.email,
      phone: this.profileData.phone,
      designerId: this.profileData.designerId,
    };
    this.showEditProfileModal = true;
  }

  closeEditProfileModal() {
    this.showEditProfileModal = false;
  }

  async saveProfile() {
    this.profileData.name = this.editForm.name;
    this.profileData.username = this.editForm.username;
    this.profileData.email = this.editForm.email;
    this.profileData.phone = this.editForm.phone;
    this.profileData.designerId = this.editForm.designerId;
    this.showEditProfileModal = false;

    const toast = await this.toastController.create({
      message: 'Profile updated successfully!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  changeProfilePic() {
    console.log('Change profile picture');
    // In a real app, open file picker
    this.showToast('Profile picture feature coming soon');
  }

  // ✅ Info Modal
  openInfoModal(title: string, message: string, icon: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalIcon = icon;
    this.showInfoModal = true;
  }

  closeInfoModal() {
    this.showInfoModal = false;
  }

  // ✅ Select Modal
  openSelectModal(title: string, options: string[], icon: string) {
    this.modalTitle = title;
    this.modalOptions = options;
    this.modalIcon = icon;
    this.currentSelectKey = title;
    this.showSelectModal = true;
  }

  closeSelectModal() {
    this.showSelectModal = false;
  }

  isOptionSelected(option: string): boolean {
    switch (this.currentSelectKey) {
      case 'Language': return this.selectedLanguage === option;
      case 'Measurement Units': return this.selectedUnit === option;
      case 'Default View': return this.selectedView === option;
      case 'Color Theme': return this.selectedTheme === option;
      case '3D Preview Quality': return this.selectedQuality === option;
      default: return false;
    }
  }

  selectOption(option: string) {
    switch (this.currentSelectKey) {
      case 'Language': this.selectedLanguage = option; break;
      case 'Measurement Units': this.selectedUnit = option; break;
      case 'Default View': this.selectedView = option; break;
      case 'Color Theme': this.selectedTheme = option; break;
      case '3D Preview Quality': this.selectedQuality = option; break;
    }
    this.closeSelectModal();
  }

  // ✅ Content Modal
  openContentModal(title: string, content: string, icon: string) {
    this.modalTitle = title;
    this.modalContent = content;
    this.modalIcon = icon;
    this.showContentModal = true;
  }

  closeContentModal() {
    this.showContentModal = false;
  }

  // ✅ Confirm Modal
  openConfirmModal(title: string, message: string, icon: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalIcon = icon;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  async confirmAction() {
    this.closeConfirmModal();
    const toast = await this.toastController.create({
      message: 'Cache cleared successfully',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  // Toggles
  toggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
  }

  toggleNotifications(event: any) {
    this.notifications = event.detail.checked;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}