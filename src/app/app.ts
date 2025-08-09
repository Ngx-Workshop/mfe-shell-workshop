import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { HeaderComponent } from './header';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    AsyncPipe,
    JsonPipe,
    HeaderComponent,
  ],
  template: `
    <ngx-header
      [mfeRemoteUrl]="(headerMfeRemoteUrl$ | async) ?? 'String'"
    ></ngx-header>
    <a mat-flat-button routerLink="/seed-mfe">Go to Seed MFE</a>
    <pre><code>{{ remotes$ | async | json }}</code></pre>
    <router-outlet />
  `,
})
export class App {
  protected title = 'ngx-workshop-shell';
  protected remotes$ = inject(MfeRegistryService).remotes$;
  protected headerMfeRemoteUrl$ = this.remotes$.pipe(
    map((remotes) => remotes[1].remoteEntryUrl)
  );
}
