import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);
  remotes = new BehaviorSubject<IMfeRemote[]>([]);
  remotes$ = this.remotes.asObservable();

  // Reactive structural modes that MFEs can respond to
  structuralModes = new BehaviorSubject<StructuralOverrides>({
    header: StructuralOverrideMode.FULL,
    nav: StructuralNavOverrideMode.VERBOSE,
    footer: StructuralOverrideMode.FULL,
  });
  structuralModes$ = this.structuralModes.asObservable();

  // This will be called when the router navigates to a new page
  setStructuralMode(partial: Partial<StructuralOverrides>) {
    this.structuralModes.next({ ...this.structuralModes.value, ...partial });
  }

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

  // Structural MFE remote URLs
  headerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.HEADER);
  footerRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.FOOTER);
  navigationRemoteUrl$ = this.getRemoteUrlBySubType(StructuralSubType.NAV);

  // Called during provideAppInitializer
  loadMfeRemotes() {
    return this.http
      .get<IMfeRemote[]>('/api/mfe-remotes')
      .pipe(tap((remotes) => this.remotes.next(remotes)));
  }
}
