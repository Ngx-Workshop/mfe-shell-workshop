import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: 'seed-mfe',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: '/remotes/ngx-seed-mfe/remoteEntry.js',
        exposedModule: './Component',
      }).then(m => m.App) // Adjust if your remote exposes a different module
  }
];