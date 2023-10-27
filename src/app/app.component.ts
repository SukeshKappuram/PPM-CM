import { Component } from '@angular/core';

import { Spinkit } from 'ng-http-loader';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cafm';
  bgColor = '#049aad';
  public spinkit = Spinkit;

  constructor(private themeService: ThemeService) {
    if (this.themeService.isDemoVersion()) {
      themeService.setDarkTheme();
      this.bgColor = '#3f51b5';
    }
    this.themeService.setPageTitle();
  }

  onActivate(event: any) {
    window.scroll(0, 0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    document.body.scrollTop = 0;
    //document.querySelector('body').scrollTo(0,0)
  }
}
