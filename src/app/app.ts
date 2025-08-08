import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  imports: [RouterOutlet, RouterLink, MatButtonModule],
  template: `
    <h1>Welcome to {{ title }}!</h1>
    <a mat-flat-button routerLink="/seed-mfe">Go to Seed MFE</a>
    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected title = 'ngx-workshop-shell';

  protected mfeRegistryService = inject(MfeRegistryService);

  constructor() {
    this.mfeRegistryService.load().subscribe({
      next: () => console.log('MFE registry loaded successfully'),
      error: (err) => console.error('Failed to load MFE registry', err)
    });
  }
}
