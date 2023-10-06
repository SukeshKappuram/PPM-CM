import { INavaigationState } from './../models/interfaces/INavaigationState';
import { INavigatedMenu } from '../models/interfaces/INavigatedMenu';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navState: INavaigationState = {
    selectedMenu: '',
    selectedSubMenu: '',
    selectedGroup: '',
    currentAssertId: 0,
    currentAuditId: 0,
    currentInstructionId: 0,
    currentQuestionId: 0,
    currentSchedulerId: 0,
    currentMRId: 0,
    currentLogId: 0,
    currentMasterId: 0,
    isAssetIdValid: false,
    isEditable: false,
    editUrl: '',
    assetData: null,
    isHeaderCall: false
  };

  navigationHistory: INavigatedMenu[] = [];

  constructor() {}

  setNavigationState(newState: INavaigationState): void {
    this.navState = newState;
    window.sessionStorage.removeItem('navigationState');
    window.sessionStorage.setItem(
      'navigationState',
      JSON.stringify(this.navState)
    );
  }

  getNavigationState(): INavaigationState {
    let navState = sessionStorage.getItem('navigationState');
    if (navState) {
      this.navState = JSON.parse(navState);
    }
    return this.navState;
  }

  setNavigationHistory(navigatedItem: INavigatedMenu): void {
    this.navigationHistory = this.getNavigationHistory();
    let lastNavHistory =
      this.navigationHistory.length > 0
        ? this.navigationHistory[this.navigationHistory.length - 1]
        : null;
    if (
      lastNavHistory?.menuName?.toLowerCase() !==
      navigatedItem?.menuName?.toLowerCase()
    ) {
      this.navigationHistory.push(navigatedItem);
    }
    window.sessionStorage.removeItem('navigationHistory');
    window.sessionStorage.setItem(
      'navigationHistory',
      JSON.stringify(this.navigationHistory)
    );
  }

  getNavigationHistory(): INavigatedMenu[] {
    let navHistory = sessionStorage.getItem('navigationHistory');
    if (navHistory) {
      this.navigationHistory = JSON.parse(navHistory);
    } else {
      this.navigationHistory = [];
    }
    return this.navigationHistory;
  }

  clearNavigationHistory(clearAll: boolean = false): boolean {
    let navHistory = sessionStorage.getItem('navigationHistory');
    if (navHistory) {
      this.navigationHistory = JSON.parse(navHistory);
      if (clearAll) {
        this.navigationHistory = [];
      } else {
        this.navigationHistory.pop();
      }
      window.sessionStorage.removeItem('navigationHistory');
      window.sessionStorage.setItem(
        'navigationHistory',
        JSON.stringify(this.navigationHistory)
      );
      return true;
    }
    return false;
  }

  getLastNavigationState(): string {
    let navigationHistory = this.getNavigationHistory();
    let lastAccessedMenu = navigationHistory[0];
    if (navigationHistory.length > 1) {
      lastAccessedMenu = navigationHistory[navigationHistory.length - 2];
    }
    this.setNavigationState(lastAccessedMenu.navState);
    this.clearNavigationHistory();
    return lastAccessedMenu.menuUrl;
  }
}
