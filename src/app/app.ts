import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  MfeRegistryService,
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from './services/mfe-registry.service';
import { StructuralMfeComponent } from './structural-mfe';

@Component({
  selector: 'ngx-root',
  imports: [RouterOutlet, MatButtonModule, AsyncPipe, StructuralMfeComponent],
  template: `
    @if(viewModel$ | async; as vm) {
    <ngx-structural-mfe
      [mfeRemoteUrl]="vm.navigationMfeRemoteUrl ?? ''"
      [mode]="vm.modes.nav ?? VERBOSE"
    ></ngx-structural-mfe>
    <div class="layout">
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
  protected readonly VERBOSE = StructuralNavOverrideMode.VERBOSE;
  private registry = inject(MfeRegistryService);

  // URL for the header structural MFE and the current structural modes
  protected viewModel$ = combineLatest({
    headerMfeRemoteUrl: this.registry.headerRemoteUrl$,
    footerMfeRemoteUrl: this.registry.footerRemoteUrl$,
    navigationMfeRemoteUrl: this.registry.navigationRemoteUrl$,
    modes: this.registry.structuralModes$,
  });
}
