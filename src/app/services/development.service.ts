import { Inject } from '@angular/core';
import { IMfeRemote } from './mfe-registry.service';

@Inject({ providedIn: 'root' })
export class DevelopmentService {
  // Going to store the data in the localstorage from another app
  // We need look in the localstorage for any matching IMfeRemote ids
  // We need to overwrite the matched remote's remoteEntryUrl with the one from the localstorage
  // The method will return an observable of the updated IMfeRemote array
}
