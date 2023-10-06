import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private account = new BehaviorSubject('none');
  private stateSource = new BehaviorSubject('none');
  private reportedDate = new BehaviorSubject(new Date());
  private loggedUser = new BehaviorSubject({
    email: '',
    designation: ''
  });
  private tasklog = new BehaviorSubject('');
  private filterConfig = new BehaviorSubject({});


  currentAccount = this.account.asObservable();
  currentState = this.stateSource.asObservable();
  loggedDate = this.reportedDate.asObservable();
  loggedByUser = this.loggedUser.asObservable();
  currentTaskLog = this.tasklog.asObservable();
  appliedFilterConfig = this.filterConfig.asObservable();


  constructor() { }

  updateAccount(account: string){
    this.account.next(account);
  }

  updateState(state: string) {
    this.stateSource.next(state);
  }

  updateReportedDate(date: any) {
    this.reportedDate.next(date);
  }

  updateTasklog(tasklog: any){
    this.tasklog.next(tasklog);
  }

  updateLoggedByUser(user: any){
    this.loggedUser.next(user);
  }

  filterApplied(filterConfig: any){
    this.filterConfig.next(filterConfig);
  }
}
