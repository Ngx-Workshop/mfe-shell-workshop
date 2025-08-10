import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function registerIcons(
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
