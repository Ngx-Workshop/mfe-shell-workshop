import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NgxUserMetadataService } from '@tmdjr/ngx-user-metadata';
import { combineLatest, filter, map } from 'rxjs';
import { StructuralMfeComponent } from './components/structural-mfe';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-workshop-shell',
  imports: [RouterOutlet, MatButtonModule, AsyncPipe, StructuralMfeComponent],
  template: `
    @if (viewModel$ | async; as vm) {
      <div
        class="layout"
        [class.no-nav]="vm.modes.nav === 'disabled'"
        [attr.data-nav-mode]="vm.modes.nav"
      >
        <aside class="nav">
          <ngx-structural-mfe
            class="nav-mfe"
            [mfeRemoteUrl]="vm.navigationMfeRemoteUrl ?? ''"
            [mode]="vm.modes.nav ?? 'disabled'"
            [role]="vm.role ?? 'none'"
          ></ngx-structural-mfe>
        </aside>

        <header>
          <ngx-structural-mfe
            [mfeRemoteUrl]="vm.headerMfeRemoteUrl ?? ''"
            [mode]="vm.modes.header ?? 'disabled'"
            [role]="vm.role ?? 'none'"
          ></ngx-structural-mfe>
        </header>

        <main>
          <router-outlet />
        </main>

        <footer>
          <ngx-structural-mfe
            [mfeRemoteUrl]="vm.footerMfeRemoteUrl ?? ''"
            [mode]="vm.modes.footer ?? 'disabled'"
            [role]="vm.role ?? 'none'"
          ></ngx-structural-mfe>
        </footer>
      </div>
    }
  `,
  styles: [
    `
      .layout[data-nav-mode='full'] {
        --ngx-rail-width: 176px;
      }
      .layout[data-nav-mode='relaxed'] {
        --ngx-rail-width: 136px;
      }
      .layout[data-nav-mode='compact'] {
        --ngx-rail-width: 88px;
      }
      .layout {
        display: grid;
        grid-template-columns: var(--ngx-rail-width, 176px) minmax(0, 1fr);
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
        inline-size: var(--ngx-rail-width, 176px);
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
        min-inline-size: 0;
      }
      footer {
        grid-area: footer;
      }
      @media (max-width: 720px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto 1fr auto;
          grid-template-areas: 'nav' 'header' 'main' 'footer';
          height: auto;
          min-height: 100dvh;
        }
        .nav {
          position: relative;
          inline-size: 100%;
          height: auto;
        }
      }
      /* Collapse to a single-column layout when the nav MFE is hidden or not rendered */
      .layout.no-nav {
        grid-template-columns: 1fr;
        grid-template-areas:
          'header'
          'main'
          'footer';
        .nav {
          display: none;
        }
      }
    `,
  ],
})
export class App {
  private metadata = inject(NgxUserMetadataService);
  private registry = inject(MfeRegistryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // URL for the header structural MFE and the current structural modes
  protected viewModel$ = combineLatest({
    userJourneyRemotes: this.registry.userJourneyRemotes$,
    headerMfeRemoteUrl: this.registry.headerRemoteUrl$,
    footerMfeRemoteUrl: this.registry.footerRemoteUrl$,
    navigationMfeRemoteUrl: this.registry.navigationRemoteUrl$,
    modes: this.registry.structuralModes$,
    role: this.metadata.userMetadata$.pipe(map((m) => m?.role)),
  });

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // find deepest active route
        let current = this.route.firstChild;
        while (current && current.firstChild) {
          current = current.firstChild;
        }
        const overrides = current?.snapshot.data?.['structuralOverrides'];
        this.registry.setStructuralMode(overrides ? overrides : {});
      });
  }
}
