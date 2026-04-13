import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  optionsOutline,
  searchOutline,
  createOutline,
  trashOutline,
  addOutline,
  ellipsisHorizontal,
  closeCircle,
  playOutline,
  copyOutline,
  folderOpenOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

interface Project {
  id: number;
  name: string;
  rooms: number;
  floors: number;
  progress: number;
  lastModified: string;
  image: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonBackButton, IonIcon],
})
export class ProjectsPage {
  searchQuery: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = 'checkmark-circle-outline';

  projects: Project[] = [
    {
      id: 1,
      name: 'Modern Villa',
      rooms: 3,
      floors: 2,
      progress: 75,
      lastModified: '2 hours ago',
      image: '../../../assets/projects/project2.png',
    },
    {
      id: 2,
      name: 'Beach House',
      rooms: 4,
      floors: 2,
      progress: 45,
      lastModified: '1 day ago',
      image: '../../../assets/projects/project3.png',
    },
    {
      id: 3,
      name: 'Mountain Cabin',
      rooms: 5,
      floors: 3,
      progress: 100,
      lastModified: '3 days ago',
      image: '../../../assets/projects/project4.png',
    },
  ];

  filteredProjects: Project[] = [];

  constructor() {
    addIcons({
      ellipsisHorizontal,
      searchOutline,
      optionsOutline,
      createOutline,
      trashOutline,
      addOutline,
      arrowBackOutline,
      closeCircle,
      playOutline,
      copyOutline,
      folderOpenOutline,
      checkmarkCircleOutline,
    });

    this.filteredProjects = [...this.projects];
  }

  openMenuOptions() {
    this.showToastMessage('Menu options opened', 'ellipsis-horizontal');
  }

  openFilterOptions() {
    this.showToastMessage('Filter options opened', 'options-outline');
  }

  filterProjects() {
    if (!this.searchQuery) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredProjects = this.projects.filter((project) =>
      project.name.toLowerCase().includes(query),
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredProjects = [...this.projects];
    this.showToastMessage('Search cleared', 'close-circle');
  }

  viewProjectDetails(project: Project) {
    this.showToastMessage(`Viewing ${project.name}`, 'eye-outline');
  }

  loadProject(project: Project, event: Event) {
    event.stopPropagation();
    this.showToastMessage(`Loading ${project.name}...`, 'play-outline');
  }

  editProject(project: Project, event: Event) {
    event.stopPropagation();
    this.showToastMessage(`Editing ${project.name}`, 'create-outline');
  }

  duplicateProject(project: Project, event: Event) {
    event.stopPropagation();

    const newProject: Project = {
      ...project,
      id: this.projects.length + 1,
      name: `${project.name} (Copy)`,
      progress: 0,
      lastModified: 'Just now',
    };

    this.projects.unshift(newProject);
    this.filteredProjects = [...this.projects];
    this.showToastMessage(
      `${project.name} duplicated successfully`,
      'copy-outline',
    );
  }

  deleteProject(project: Project, event: Event) {
    event.stopPropagation();

    const index = this.projects.findIndex((p) => p.id === project.id);
    if (index > -1) {
      const projectName = project.name;
      this.projects.splice(index, 1);
      this.filterProjects();
      this.showToastMessage(`${projectName} deleted`, 'trash-outline');
    }
  }

  createNewProject() {
    this.showToastMessage('Create new project', 'add-outline');
  }

  getCompletedProjects(): number {
    return this.projects.filter((p) => p.progress === 100).length;
  }

  getInProgressProjects(): number {
    return this.projects.filter((p) => p.progress < 100).length;
  }

  private showToastMessage(
    message: string,
    icon: string = 'checkmark-circle-outline',
  ) {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}
