import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
  effect,
  inject,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { StructuralOverrideMode } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-header',
  template: ``,
})
export class HeaderComponent implements OnInit {
  protected viewContainer = inject(ViewContainerRef);
  mfeRemoteUrl = input.required<string>();
  mode = input.required<StructuralOverrideMode>();
  private cmpRef?: ComponentRef<any>;

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl(),
        exposedModule: './Component',
      });

      this.cmpRef = this.viewContainer.createComponent(remoteComponent.default);
      this.cmpRef.setInput?.('mode', this.mode());

      effect(() => {
        if (this.cmpRef) {
          this.cmpRef.setInput?.('mode', this.mode());
        }
      });
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}

@Component({
  selector: 'ngx-footer',
  template: ``,
})
export class FooterComponent implements OnInit {
  protected viewContainer = inject(ViewContainerRef);
  mfeRemoteUrl = input.required<string>();
  mode = input.required<StructuralOverrideMode>();
  private cmpRef?: ComponentRef<any>;

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl(),
        exposedModule: './Component',
      });

      this.cmpRef = this.viewContainer.createComponent(remoteComponent.default);
      this.cmpRef.setInput?.('mode', this.mode());

      effect(() => {
        if (this.cmpRef) {
          this.cmpRef.setInput?.('mode', this.mode());
        }
      });
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
