import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash2', 
    pathMatch: 'full',
  },
  {
    path: 'splash2', 
    loadComponent: () =>
      import('./splash2/splash2.page').then((m) => m.Splash2Page),
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.page').then((m) => m.SignupPage),
  },
  {
    // This is the parent route for your main app content
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'projects1',
        loadComponent: () =>
          import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
      },
      {
        path: 'materials-library',
        loadComponent: () =>
          import('./pages/materials-library/materials-library.page').then(
            (m) => m.MaterialsLibraryPage,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'photo-design',
        loadComponent: () =>
          import('./pages/photo-design/photo-design.page').then(
            (m) => m.PhotoDesignPage,
          ),
      },
    ],
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
  },
  {
    path: 'new-architecture-project',
    loadComponent: () =>
      import('./pages/new-architecture-project/new-architecture-project.page').then(
        (m) => m.NewArchitectureProjectPage,
      ),
  },
  {
    path: 'materials-library',
    loadComponent: () =>
      import('./pages/materials-library/materials-library.page').then(
        (m) => m.MaterialsLibraryPage,
      ),
  },
  {
    path: 'photo-design',
    loadComponent: () =>
      import('./pages/photo-design/photo-design.page').then(
        (m) => m.PhotoDesignPage,
      ),
  },
  {
    path: 'projects1',
    loadComponent: () =>
      import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: '3d-house-view',
    loadComponent: () =>
      import('./pages/3d-house-view/3d-house-view.page').then(
        (m) => m.ThreeDHouseViewPage,
      ),
  },  {
    path: 'room-list',
    loadComponent: () => import('./pages/room-list/room-list.page').then( m => m.RoomListPage)
  },
  {
    path: 'favorite-materials',
    loadComponent: () => import('./pages/favorite-materials/favorite-materials.page').then( m => m.FavoriteMaterialsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'help-support',
    loadComponent: () => import('./pages/help-support/help-support.page').then( m => m.HelpSupportPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'my-photo-design',
    loadComponent: () => import('./pages/my-photo-design/my-photo-design.page').then( m => m.MyPhotoDesignPage)
  },

];
