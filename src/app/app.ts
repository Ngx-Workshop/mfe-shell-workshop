import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { combineLatest } from 'rxjs';
import { StructuralMfeComponent } from './components/structural-mfe';
import {
  MfeRegistryService,
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    AsyncPipe,
    StructuralMfeComponent,
  ],
  template: `
    @if(viewModel$ | async; as vm) {
    <div class="layout">
      <aside class="nav">
        <ngx-structural-mfe
          class="nav-mfe"
          [mfeRemoteUrl]="vm.navigationMfeRemoteUrl ?? ''"
          [mode]="vm.modes.nav ?? VERBOSE"
        ></ngx-structural-mfe>
      </aside>

      <header>
        <ngx-structural-mfe
          [mfeRemoteUrl]="vm.headerMfeRemoteUrl ?? ''"
          [mode]="vm.modes.header ?? FULL"
        ></ngx-structural-mfe>
      </header>

      <main>
        <router-outlet />
      </main>

      <footer>
        <ngx-structural-mfe
          [mfeRemoteUrl]="vm.footerMfeRemoteUrl ?? ''"
          [mode]="vm.modes.footer ?? FULL"
        ></ngx-structural-mfe>
      </footer>
    </div>
    }
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 110px 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          'nav header'
          'nav main'
          'nav footer';
        min-height: 100dvh;
        height: 100dvh;
      }
      .nav {
        grid-area: nav;
        overflow: hidden;
        position: fixed;
        top: 0;
        height: 100dvh;
        z-index: 2;
      }
      header {
        grid-area: header;
        position: sticky;
        top: 0;
        z-index: 3;
      }
      main {
        grid-area: main;
      }
      footer {
        grid-area: footer;
      }
      /* Collapse to a single-column layout when the nav MFE is hidden or not rendered */
      .layout:not(:has(.nav-mfe:not([hidden]))) {
        grid-template-columns: 1fr;
        grid-template-areas:
          'header'
          'main'
          'footer';
      }
    `,
  ],
})
export class App {
  protected readonly FULL = StructuralOverrideMode.FULL;
  protected readonly VERBOSE = StructuralNavOverrideMode.VERBOSE;
  private registry = inject(MfeRegistryService);

  // URL for the header structural MFE and the current structural modes
  protected viewModel$ = combineLatest({
    userJourneyRemotes: this.registry.userJourneyRemotes$,
    headerMfeRemoteUrl: this.registry.headerRemoteUrl$,
    footerMfeRemoteUrl: this.registry.footerRemoteUrl$,
    navigationMfeRemoteUrl: this.registry.navigationRemoteUrl$,
    modes: this.registry.structuralModes$,
  });
}
