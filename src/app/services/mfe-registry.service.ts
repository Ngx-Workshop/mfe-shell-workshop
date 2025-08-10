import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, tap } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);

  remotes = new BehaviorSubject<IMfeRemote[]>([]);
  remotes$ = this.remotes.asObservable().pipe(
    map((remotes) => this.getUpdatedRemotesFromLocalStorage(remotes)),
    shareReplay(1)
  );

  // Structural MFE remote URLs
  headerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.HEADER);
  footerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.FOOTER);
  navigationRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.NAV);

  // user-journey MFE remote URLs
  userJourneyRemoteUrls$ = this.remotes$.pipe(
    map((remotes) =>
      remotes
        .filter((remote) => remote.type === MfeRemoteType.USER_JOURNEY)
        .map((remote) => remote.remoteEntryUrl)
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
    console.log(
      '[MFE REGISTRY] Checking local storage for remote overrides',
      remotes
    );
    const updatedRemotes = remotes.map((remote) => {
      const localStorageKey = `mfe-remote-${remote._id}`;
      const localStorageValue = localStorage.getItem(localStorageKey);
      console.log(
        `[MFE REGISTRY] Local storage value for ${localStorageKey}:`,
        localStorageValue
      );
      if (localStorageValue) {
        try {
          const parsedValue = localStorageValue;
          return { ...remote, remoteEntryUrl: parsedValue };
        } catch (error) {
          console.error(
            `Error parsing local storage value for ${localStorageKey}`,
            error
          );
        }
      }
      return remote;
    });
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
}
