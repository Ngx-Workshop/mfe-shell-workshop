import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';

import type {
  MfeRemoteDto,
  StructuralOverridesDto,
  StructuralSubType,
} from '@tmdjr/ngx-mfe-orchestrator-contracts';

export function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);

  remotes = new BehaviorSubject<MfeRemoteDto[]>([]);
  remotes$ = this.remotes.asObservable();

  // Structural MFE remote URLs
  headerRemoteUrl$ = this.getRemoteUrlBySubType('header');
  footerRemoteUrl$ = this.getRemoteUrlBySubType('footer');
  navigationRemoteUrl$ = this.getRemoteUrlBySubType('nav');

  // user-journey MFE remote
  userJourneyRemotes$ = this.remotes$.pipe(
    map((remotes) =>
      remotes
        .filter((remote) => remote.type === 'user-journey')
        .map((remote) => remote)
    )
  );

  // Reactive structural modes that MFEs can respond to
  structuralModes = new BehaviorSubject<StructuralOverridesDto>({
    header: 'full',
    nav: 'verbose',
    footer: 'full',
  });
  structuralModes$ = this.structuralModes.asObservable();

  // Helper method to get remote URL by structural sub type
  private getRemoteUrlBySubType(subType: StructuralSubType) {
    return this.remotes$.pipe(
      map((remotes) =>
        this.getUpdatedRemotesFromLocalStorage(remotes)
      ),
      map(
        (remotes) =>
          remotes.find(
            (remote) => remote.structuralSubType === subType
          )?.remoteEntryUrl
      )
    );
  }

  private getUpdatedRemotesFromLocalStorage(
    remotes: MfeRemoteDto[]
  ): MfeRemoteDto[] {
    const updatedRemotes = remotes.map((remote) => {
      const localStorageKey = `mfe-remotes:${remote._id}`;
      const remoteEntryUrl = localStorage.getItem(localStorageKey);
      return remoteEntryUrl ? { ...remote, remoteEntryUrl } : remote;
    });
    return updatedRemotes;
  }

  // This will be called when the router navigates to a new page
  setStructuralMode(partial: Partial<StructuralOverridesDto>) {
    this.structuralModes.next({
      ...this.structuralModes.value,
      ...partial,
    });
  }

  // Called during provideAppInitializer
  loadMfeRemotes() {
    return this.http
      .get<MfeRemoteDto[]>('/api/mfe-remotes')
      .pipe(tap((remotes) => this.remotes.next(remotes)));
  }

  /**
   * Build `Routes` from current user-journey remotes.
   * Path = slug(name), remoteEntry = remoteEntryUrl
   */
  buildUserJourneyRoutes(): Routes {
    return this.getUpdatedRemotesFromLocalStorage(this.remotes.value)
      .filter((r) => r.type === 'user-journey')
      .map((r) => ({
        path: toSlug(r.name),
        data: { structuralOverrides: r.structuralOverrides },
        loadComponent: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: r.remoteEntryUrl,
            exposedModule: './Component',
          }).then((m) => m.App),
      }));
  }

  /**
   * Register dynamic routes on the router. Optionally merge with provided static routes.
   * Call this after `loadMfeRemotes()` resolves (e.g., from an APP_INITIALIZER).
   */
  registerUserJourneyRoutes(
    router: Router,
    staticRoutes: Routes = []
  ): void {
    const dynamic = this.buildUserJourneyRoutes();
    router.resetConfig([...staticRoutes, ...dynamic]);

    console.log(
      '%c[MFE REGISTRY] Registered dynamic routes:',
      'color: green; font-weight: bold;',
      dynamic
    );
  }
}
