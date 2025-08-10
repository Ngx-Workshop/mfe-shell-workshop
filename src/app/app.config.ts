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
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  return firstValueFrom(mfeRegistryService.loadMfeRemotes());
}

function registerIcons(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
) {
  return () => {
    const openAiIconSvg = document.querySelector(
      '#openai_white_logomark'
    )?.outerHTML;
    openAiIconSvg &&
      matIconRegistry.addSvgIconLiteral(
        'openai_white_logomark',
        domSanitizer.bypassSecurityTrustHtml(openAiIconSvg)
      );

    const rxjsIconSvg = document.querySelector(
      '#rxjs_white_logomark'
    )?.outerHTML;
    rxjsIconSvg &&
      matIconRegistry.addSvgIconLiteral(
        'rxjs_white_logomark',
        domSanitizer.bypassSecurityTrustHtml(rxjsIconSvg)
      );

    const nestjsIconSvg = document.querySelector(
      '#nestjs_white_logomark'
    )?.outerHTML;
    nestjsIconSvg &&
      matIconRegistry.addSvgIconLiteral(
        'nestjs_white_logomark',
        domSanitizer.bypassSecurityTrustHtml(nestjsIconSvg)
      );

    const angularIconSvg = document.querySelector(
      '#angular_white_logomark'
    )?.outerHTML;
    angularIconSvg &&
      matIconRegistry.addSvgIconLiteral(
        'angular_white_logomark',
        domSanitizer.bypassSecurityTrustHtml(angularIconSvg)
      );
  };
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
