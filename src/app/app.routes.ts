import { Routes } from '@angular/router';

// Routes are registered dynamically at runtime from MfeRegistryService
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/seed-mfe',
    pathMatch: 'full',
  },
];
