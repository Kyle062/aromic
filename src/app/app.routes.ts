import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
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
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/projects.page').then((m) => m.ProjectsPage),
      },
      {
        path: 'library',
        loadComponent: () =>
          import('./library/library.page').then((m) => m.LibraryPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: 'new-architecture-project',
    loadComponent: () => import('./pages/new-architecture-project/new-architecture-project.page').then( m => m.NewArchitectureProjectPage)
  },
  {
    path: 'materials-library',
    loadComponent: () => import('./pages/materials-library/materials-library.page').then( m => m.MaterialsLibraryPage)
  },  {
    path: 'photo-design',
    loadComponent: () => import('./pages/photo-design/photo-design.page').then( m => m.PhotoDesignPage)
  },

];
