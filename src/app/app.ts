import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  imports: [RouterOutlet, RouterLink, MatButtonModule, AsyncPipe, JsonPipe],
  template: `
    <h1>Welcome to {{ title }}!</h1>
    <a mat-flat-button routerLink="/seed-mfe">Go to Seed MFE</a>
    {{ remotes$ | async | json }}
    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected title = 'ngx-workshop-shell';
  protected remotes$ = inject(MfeRegistryService).remotes$;
}
