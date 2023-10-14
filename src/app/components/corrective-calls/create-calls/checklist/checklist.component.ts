import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonComponent } from 'src/app/components/common/common.component';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent extends CommonComponent implements OnInit {
  answers: any[] = [];
  @Input() checkListItems: any;
  @Input() isChecklist: boolean = false;
  @Input() tabId: any;
  @Input() statusId: any;
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Input() isLocked: boolean = false;
  @Output() dataModified: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  selectedAnswer: number = 0;
  imageUrl: string = 'assets/images/noimage-SM.png';

  ServiceStatus = ServiceStatus;

  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService
  ) {
    super();
    this.navState = this.navService.getNavigationState();
  }

  ngOnInit(): void {
    if (!this.checkListItems) {
      this.getChecklistData();
    } else {
      this.updateAnswers(this.checkListItems);
    }
  }

  selectAll(answerId: number) {
    if (!this.isLocked) {
      if (this.selectedAnswer === answerId) {
        this.selectedAnswer = 0;
      } else {
        this.selectedAnswer = answerId;
      }
      if (this.answers.length === 0) {
        this.updateAnswers();
      }
      this.answers.forEach((element: any) => {
        element.answerId = this.selectedAnswer;
      });
    }
    this.validateForm();
  }

  validateForm() {
    if (this.answers.every((element: any) => element.answerId > 0)) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }
  }

  selectAnswer(index: number, answerId: number) {
    if (!this.isLocked) {
      if (this.answers.length === 0) {
        this.updateAnswers();
      }
      this.answers[index].answerId = answerId;
      this.updateSelectedAnswer();
    }
    this.validateForm();
  }

  updateComment(index: number, comment: any) {
    if (!this.isLocked) {
      let answer = this.answers[index];
      answer.comments = comment.target.value;
    }
    this.validateForm();
  }

  updateAnswers(checklistItems?: any): any {
    if (checklistItems) {
      this.checkListItems = checklistItems;
    }
    let taskLogId = this.navState.currentLogId;
    this.answers = [];
    this.checkListItems?.questions?.forEach((question: any) => {
      let answer = this.checkListItems?.questionAnswers?.find(
        (answer: any) => answer.linkId === question.id
      );
      this.answers.push({
        id: answer?.id ?? 0,
        taskLogId: taskLogId,
        answerId: answer?.answerId ?? 0,
        linkId: question.id,
        comments: answer?.comments ?? '',
        imageUrl: answer?.imageUrl ?? '',
        isCheckListItem: this.isChecklist
      });
    });
    this.updateSelectedAnswer();
  }

  updateSelectedAnswer() {
    if (!this.isLocked) {
      let answers = this.answers.map((ans) => ans.answerId);
      let filtered = answers.filter(function (item, pos) {
        return answers.indexOf(item) == pos;
      });
      if (filtered.length === 1) {
        this.selectedAnswer = filtered[0];
      } else {
        this.selectedAnswer = 0;
      }
    }
  }

  override save(): void {
    if (this.isFormValid && !this.isLocked) {
      this.apiService
        .AddOrUpdateChecklistData(
          'TaskLogOperations/SaveTaskLogQuestionnaire',
          this.answers,
          this.api
        )
        .subscribe({
          next: (result: any) => {
            if (result) {
              this.alertService
                .success('Checklist updated Successfully!!', {
                  id: 'alert-taskLog'
                })
                .then(() => {
                  this.getChecklistData();
                });
            }
          },
          error: (e: any) => {
            this.alertService.error(
              'Error retreving additional information !!',
              {
                id: 'alert-taskLog'
              }
            );
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  getChecklistData(): void {
    this.apiService
      .GetTaskLog(
        `${this.urlnode}/GetTaskLogAdditionalInfo/${this.navState.currentLogId}`,
        this.api
      )
      .subscribe({
        next: (result) => {
          this.dataChanged.emit(result);
          this.checkListItems = this.isChecklist
            ? result.checkListItems
            : result.hseqListItems;
          this.updateAnswers();
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Additional Data !!', {
            id: 'alert-resource'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }

  onSelect(index: number, event: any): void {
    if (!this.isLocked) {
      let answer = this.answers[index];
      answer.file = event.addedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.addedFiles[0]);
      reader.onload = () => {
        this.answers[index].imageUrl = reader.result?.toString();
      };
      this.checkListItems.questionAnswers[index] = answer;
    }
    this.validateForm();
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
