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
import {
  provideRouter,
  Router,
  withViewTransitions,
} from '@angular/router';
import { NGX_EDITORJS_OPTIONS } from '@tmdjr/ngx-editor-js2';
import { NgxEditorJs2BlockquotesComponent } from '@tmdjr/ngx-editor-js2-blockquotes';
import { NgxEditorJs2CodemirrorComponent } from '@tmdjr/ngx-editor-js2-codemirror';
import { NgxEditorJs2ImageComponent } from '@tmdjr/ngx-editor-js2-image';
import { NgxEditorJs2MermaidjsComponent } from '@tmdjr/ngx-editor-js2-mermaidjs';
import { NgxEditorJs2MfeLoaderComponent } from '@tmdjr/ngx-editor-js2-mfe-loader';
import { NgxEditorJs2PanelComponent } from '@tmdjr/ngx-editor-js2-panel';
import { NgxEditorJs2PopQuizComponent } from '@tmdjr/ngx-editor-js2-pop-quiz';
import { ThemePickerService } from '@tmdjr/ngx-theme-picker';
import { authInterceptor } from '@tmdjr/ngx-user-metadata';
import { firstValueFrom, forkJoin, tap } from 'rxjs';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';
import { NavigationalListService } from './services/navigational-list.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  const navigationalListService = inject(NavigationalListService);
  const router = inject(Router);
  return firstValueFrom(
    forkJoin([
      navigationalListService.getMenuHierarchy$('WORKSHOP'),
      mfeRegistryService
        .loadMfeRemotes()
        .pipe(
          tap(() =>
            mfeRegistryService.registerUserJourneyRoutes(
              router,
              routes
            )
          )
        ),
    ])
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
    provideRouter(
      routes,
      withViewTransitions({
        // optional: you can add logic here later (skip transitions for query/fragment-only changes)
      })
    ),
    provideAnimationsAsync(),
    {
      provide: NGX_EDITORJS_OPTIONS,
      useValue: {
        consumerSupportedBlocks: [
          {
            name: 'MermaidJs',
            component: NgxEditorJs2MermaidjsComponent,
            componentInstanceName: 'NgxEditorJs2MermaidjsComponent',
          },
          {
            name: 'Panel',
            component: NgxEditorJs2PanelComponent,
            componentInstanceName: 'NgxEditorJs2PanelComponent',
          },
          {
            name: 'Image',
            component: NgxEditorJs2ImageComponent,
            componentInstanceName: 'NgxEditorJs2ImageComponent',
          },
          {
            name: 'Blockquote',
            component: NgxEditorJs2BlockquotesComponent,
            componentInstanceName: 'NgxEditorJs2BlockquotesComponent',
          },
          {
            name: 'Codemirror',
            component: NgxEditorJs2CodemirrorComponent,
            componentInstanceName: 'NgxEditorJs2CodemirrorComponent',
          },
          {
            name: 'Pop Quiz',
            component: NgxEditorJs2PopQuizComponent,
            componentInstanceName: 'NgxEditorJs2PopQuizComponent',
          },
          {
            name: 'MFE Loader',
            component: NgxEditorJs2MfeLoaderComponent,
            componentInstanceName: 'NgxEditorJs2MfeLoaderComponent',
          },
        ],
      },
    },
  ],
};
