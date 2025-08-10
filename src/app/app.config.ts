import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { registerIcons } from './app.icons';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  return firstValueFrom(mfeRegistryService.loadMfeRemotes());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initializerFn),
    provideAppInitializer(() =>
      registerIcons(inject(MatIconRegistry), inject(DomSanitizer))()
    ),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
};
