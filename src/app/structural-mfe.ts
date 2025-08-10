import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
  inject,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from './services/mfe-registry.service';

@Component({
  selector: 'ngx-structural-mfe',
  template: ``,
})
export class StructuralMfeComponent implements OnInit {
  protected viewContainer = inject(ViewContainerRef);
  mfeRemoteUrl = input.required<string>();
  mode = input.required<StructuralOverrideMode | StructuralNavOverrideMode>();
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

      // effect(() => {
      //   if (this.cmpRef) {
      //     this.cmpRef.setInput?.('mode', this.mode());
      //   }
      // });
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
