import { Router } from '@angular/router';
import { Navigate } from '../models/enums/Navigate.enum';

export class NavigationHelper {
  static router: Router;
  constructor(private r: Router) {
    NavigationHelper.router = r;
  }

  public static home() {
    this.router.navigate([Navigate.HOME]);
  }
}
