import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import {
  MfeRegistryService,
  StructuralOverrideMode,
} from './services/mfe-registry.service';
import { HeaderComponent } from './structural-components';

@Component({
  selector: 'ngx-root',
  imports: [RouterOutlet, MatButtonModule, AsyncPipe, HeaderComponent],
  template: `
    <div class="layout">
      <header>
        <ngx-header
          [mfeRemoteUrl]="(headerMfeRemoteUrl$ | async) ?? ''"
          [mode]="(modes$ | async)?.header ?? FULL"
        ></ngx-header>
      </header>

      <main>
        <router-outlet />
      </main>

      <footer>
        <!-- <ngx-footer
          [mfeRemoteUrl]="(footerMfeRemoteUrl$ | async) ?? ''"
          [mode]="(modes$ | async)?.footer ?? FULL"
        ></ngx-footer> -->
      </footer>
    </div>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          'header'
          'main'
          'footer';
        min-height: 100dvh;
      }
      header {
        grid-area: header;
      }
      main {
        grid-area: main;
      }
      footer {
        grid-area: footer;
      }
    `,
  ],
})
export class App {
  protected readonly FULL = StructuralOverrideMode.FULL;
  private registry = inject(MfeRegistryService);

  // URL for the header structural MFE and the current structural modes
  protected headerMfeRemoteUrl$ = this.registry.headerRemoteUrl$;
  protected footerMfeRemoteUrl$ = this.registry.footerRemoteUrl$;
  protected modes$ = this.registry.structuralModes$;
}
