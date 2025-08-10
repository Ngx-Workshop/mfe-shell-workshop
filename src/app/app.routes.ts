import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: '/remotes/ngx-seed-mfe/remoteEntry.js',
        exposedModule: './Component',
      }).then((m) => m.App), // Adjust if your remote exposes a different module
  },
];
