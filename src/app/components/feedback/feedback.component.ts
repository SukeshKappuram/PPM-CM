import { ActivatedRoute } from '@angular/router';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';
import { Component } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  feedbackSelected: number = 0;
  comment: string = '';
  isUserValid: boolean = false;
  key: string = '';
  savedFeedback: boolean = false;
  message: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private alertService: SweetAlertService
  ) {
    this.key = this.route.snapshot.params['key'];
    this.apiService
      .ValidateFeedBackLink(
        `FeedBack/ValidateFeedBackLink?taskLogId=${this.key}`
      )
      .subscribe({
        next: (result: any) => {
          if (result === 1) {
            this.isUserValid = true;
          } else {
            if (result === -1) {
              this.message = 'Feedback link has expired !!';
            } else if (result === -2) {
              this.message = 'Feedback has been already submited !!';
            } else if (result === -4) {
              this.message = 'In-Valid Feedback link !!';
            }
            this.alertService.error(this.message, {
              id: 'alert-taskLog'
            });
          }
        },
        error: (e: any) => {
          this.alertService.error('Error Validating Task Log !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  feedbackChanged(feedType: number) {
    this.feedbackSelected = feedType;
  }

  save(): void {
    let formData = {
      taskId: this.key,
      rating: this.feedbackSelected,
      comments: this.comment
    };
    this.apiService
      .AddOrUpdateTaskLog(
        `FeedBack/SaveTaskLogFeedBack`,
        formData,
        ApiEndpoints.PPMAPI,
        true
      )
      .subscribe({
        next: (result: any) => {
          this.savedFeedback = result;
          this.alertService.success('Feedback Submited Successfully !!', {
            id: 'alert-taskLog'
          });
        },
        error: (e: any) => {
          this.alertService.error('Error Validating Task Log !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }
}
