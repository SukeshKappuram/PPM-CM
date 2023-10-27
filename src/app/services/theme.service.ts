import { ITheme, dark, light } from "../models/interfaces/ITheme";

import { Injectable } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private active: ITheme = light;
  private availableThemes: ITheme[] = [light, dark];
  favIcon: HTMLLinkElement | null = document.querySelector('#fav-icon');
  constructor(private titleService: Title) { }

  getAvailableThemes(): ITheme[] {
    return this.availableThemes;
  }

  getActiveTheme(): ITheme {
    return this.active;
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  setDarkTheme(): void {
    this.setActiveTheme(dark);
  }

  setLightTheme(): void {
    this.setActiveTheme(light);
  }

  setActiveTheme(theme: ITheme): void {
    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }

  getVersion(): string {
    return environment.ver;
  }

  isDemoVersion(): boolean {
    return this.getVersion() === '2' || environment.isDemoVersion;
  }

  setPageTitle() {
    if (this.getVersion() == '2') {
      this.titleService.setTitle('RYNA');
      this.favIcon ? this.favIcon.href = 'assets/images/ryna-favlogo-white.ico' : null;
      return;
    }
    this.titleService.setTitle('PropEzy | FM Pro');
    this.favIcon ? this.favIcon.href = 'assets/images/fm-favicon.ico' : null;
  }

}
