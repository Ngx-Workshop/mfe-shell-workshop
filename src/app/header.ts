import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ngx-header',
  template: ``,
})
export class HeaderComponent implements OnInit {
  @ViewChild('mfeHost', { read: ViewContainerRef, static: true })
  protected mfeHost!: ViewContainerRef;

  mfeRemoteUrl = input.required<string>();

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl(),
        exposedModule: './Component',
      });
      this.mfeHost.createComponent(remoteComponent.default);
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
