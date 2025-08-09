import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface MfeRemote {
  name: string;
  remoteEntryUrl: string;
  version: number;
  status?: string;
  description?: string;
  lastUpdated?: Date;
  archived?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);
  remotes = new BehaviorSubject<MfeRemote[]>([]);
  remotes$ = this.remotes.asObservable();

  loadMfeRemotes() {
    return this.http.get<MfeRemote[]>('/api/mfe-remotes').pipe(
      tap(remotes => this.remotes.next(remotes))
    );
  }
}