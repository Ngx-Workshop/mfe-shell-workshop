import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  inject,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ngx-header',
  template: ``,
})
export class HeaderComponent implements OnInit {
  viewContainer = inject(ViewContainerRef);
  mfeRemoteUrl = input.required<string>();

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl(),
        exposedModule: './Component',
      });
      this.viewContainer.createComponent(remoteComponent.default);
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
