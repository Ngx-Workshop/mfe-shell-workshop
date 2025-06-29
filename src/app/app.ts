import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
}
