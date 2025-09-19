import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';
import { ThemePickerService } from '@tmdjr/ngx-theme-picker';
import { authInterceptor } from '@tmdjr/ngx-user-metadata';
import { firstValueFrom, tap } from 'rxjs';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  const router = inject(Router);
  return firstValueFrom(
    mfeRegistryService
      .loadMfeRemotes()
      .pipe(
        tap(() =>
          mfeRegistryService.registerUserJourneyRoutes(router, routes)
        )
      )
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initializerFn),
    provideAppInitializer(() => {
      inject(ThemePickerService);
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
};
