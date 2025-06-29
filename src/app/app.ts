import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngx-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <a routerLink="/seed-mfe">Go to Seed MFE</a>
    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected title = 'ngx-workshop-shell';
}
