import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';

export enum MfeRemoteType {
  STRUCTURAL = 'structural',
  USER_JOURNEY = 'user-journey',
}

export enum StructuralOverrideMode {
  FULL = 'full',
  RELEXED = 'relexed',
  COMPACT = 'compact',
  DISABLED = 'disabled',
}

export enum StructuralNavOverrideMode {
  VERBOSE = 'verbose',
  MINIMAL = 'minimal',
  DISABLED = 'disabled',
}

export enum StructuralSubType {
  HEADER = 'header',
  NAV = 'nav',
  FOOTER = 'footer',
}

export type StructuralOverrides = {
  header?: StructuralOverrideMode;
  nav?: StructuralNavOverrideMode;
  footer?: StructuralOverrideMode;
};

export interface IMfeRemote {
  _id: string;
  name: string;
  remoteEntryUrl: string;
  type: MfeRemoteType;
  structuralOverrides?: StructuralOverrides;
  structuralSubType?: StructuralSubType;
  version: number;
  status?: string;
  description?: string;
  lastUpdated?: Date;
  archived?: boolean;
  __v?: number;
}

export function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);

  remotes = new BehaviorSubject<IMfeRemote[]>([]);
  remotes$ = this.remotes.asObservable();

  // Structural MFE remote URLs
  headerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.HEADER);
  footerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.FOOTER);
  navigationRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.NAV);

  // user-journey MFE remote
  userJourneyRemotes$ = this.remotes$.pipe(
    map((remotes) =>
      remotes
        .filter((remote) => remote.type === MfeRemoteType.USER_JOURNEY)
        .map((remote) => remote)
    )
  );

  // Reactive structural modes that MFEs can respond to
  structuralModes = new BehaviorSubject<StructuralOverrides>({
    header: StructuralOverrideMode.FULL,
    nav: StructuralNavOverrideMode.VERBOSE,
    footer: StructuralOverrideMode.FULL,
  });
  structuralModes$ = this.structuralModes.asObservable();

  // Helper method to get remote URL by structural sub type
  private getRemoteUrlBySubType(subType: StructuralSubType) {
    return this.remotes$.pipe(
      map(
        (remotes) =>
          remotes.find((remote) => remote.structuralSubType === subType)
            ?.remoteEntryUrl
      )
    );
  }

  private getUpdatedRemotesFromLocalStorage(
    remotes: IMfeRemote[]
  ): IMfeRemote[] {
    const updatedRemotes = remotes.map((remote) => {
      const localStorageKey = `mfe-remote:${remote._id}`;
      const remoteEntryUrl = localStorage.getItem(localStorageKey);
      console.log(
        `[MFE REGISTRY] Checking local storage for remote ${remote.name}:`,
        remoteEntryUrl ? `Found URL: ${remoteEntryUrl}` : 'No URL found'
      );
      return remoteEntryUrl ? { ...remote, remoteEntryUrl } : remote;
    });
    console.log(
      '[MFE REGISTRY] Updated remotes from local storage:',
      updatedRemotes
    );
    return updatedRemotes;
  }

  // This will be called when the router navigates to a new page
  setStructuralMode(partial: Partial<StructuralOverrides>) {
    this.structuralModes.next({ ...this.structuralModes.value, ...partial });
  }

  // Called during provideAppInitializer
  loadMfeRemotes() {
    return this.http
      .get<IMfeRemote[]>('/api/mfe-remotes')
      .pipe(tap((remotes) => this.remotes.next(remotes)));
  }

  /**
   * Build `Routes` from current user-journey remotes.
   * Path = slug(name), remoteEntry = remoteEntryUrl
   */
  buildUserJourneyRoutes(): Routes {
    return this.getUpdatedRemotesFromLocalStorage(this.remotes.value)
      .filter((r) => r.type === MfeRemoteType.USER_JOURNEY)
      .map((r) => ({
        path: toSlug(r.name),
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
  registerUserJourneyRoutes(router: Router, staticRoutes: Routes = []): void {
    const dynamic = this.buildUserJourneyRoutes();
    router.resetConfig([...staticRoutes, ...dynamic]);
    // Optional: log for visibility
    console.log('[MFE REGISTRY] Registered dynamic routes:', dynamic);
  }
}
