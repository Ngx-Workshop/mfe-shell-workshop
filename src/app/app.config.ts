import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';

//APP_INITIALIZER

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  return firstValueFrom(mfeRegistryService.loadMfeRemotes());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => initializerFn()),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
};
