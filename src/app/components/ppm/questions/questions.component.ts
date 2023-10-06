import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { CommonComponent } from '../../common/common.component';
import { SweetAlertService } from './../../../services/sweet-alert.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent extends CommonComponent implements OnInit {

  constructor(private apiService: ApiService, private alertService: SweetAlertService, private navService: NavigationService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.apiService.GetHSEQuestions('HSEQ/QuestionGroups').subscribe({
      next: (result) => {
        this.gridData = result;
      },
      error: (e) => {
        this.alertService.error('Error Retrieving HSEQ Questions !!', {
          id: 'hesq-questions'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  edit(item: any) {
    let navState = this.navService.getNavigationState();
    navState.currentQuestionId = item ? item.id : 0;
    this.navService.setNavigationState(navState);
    this.router.navigate([Navigate.EDIT_QUESTION]);
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
