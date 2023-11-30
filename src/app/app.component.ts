import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TesterComponent } from './tester/tester.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, TesterComponent, TranslateModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ndt-server';
  
  constructor(public translate: TranslateService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    translate.addLangs(['en', 'pt']);
    translate.setDefaultLang('pt');
    translate.use('pt');
    this.matIconRegistry.addSvgIcon("brazil", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icon/brazil.svg"));
    this.matIconRegistry.addSvgIcon("usa", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icon/usa.svg"));
  }

  public languagesList: 
    Array<Record<'imgUrl' | 'code' | 'icon' | 'name' | 'shorthand', string>> = [
      {
        imgUrl: '/assets/images/brazil.png',
        code: 'pt',
        icon: 'brazil',
        name: 'Portuguese',
        shorthand: 'POR',
      },
      {
        imgUrl: '/assets/images/usa.png',
        code: 'en',
        icon: 'usa',
        name: 'English',
        shorthand: 'ENG',
      }
  ];

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
