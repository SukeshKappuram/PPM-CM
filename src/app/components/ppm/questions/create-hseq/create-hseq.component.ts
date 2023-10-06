import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../../helpers/buttons.json';
import { Navigate } from './../../../../models/enums/Navigate.enum';

@Component({
  selector: 'app-create-hseq',
  templateUrl: './create-hseq.component.html',
  styleUrls: ['./create-hseq.component.scss']
})
export class CreateHseqComponent extends CommonComponent{
  generalForm!: FormGroup;
  questionsForm!: FormGroup;
  qId: number = 0;
  questionGroup: any = {};
  questionDetails: any[] = [];
  canAdd: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private alertService: SweetAlertService, private navService: NavigationService, private router: Router) {
    super();
    this.isEditable = false;
    this.buttons = buttons.ppm.hseq.create;
    let navState = this.navService.getNavigationState();
    if (this.router.url === `/${Navigate.CREATE_HSEQ}`) {
      navState.currentQuestionId = 0;
      this.isEditable = true;
    }
    this.updateButtons();
    this.getQuestionGroupById(navState.currentQuestionId);
  }

  getQuestionGroupById(id: number): void {
    this.apiService.GetHSEQuestions('HSEQ/QuestionGroup/' + id).subscribe({
      next: (result) => {
        let questionData = result;
        this.questionGroup = questionData.questionGroup;
        this.qId = id;
        this.generalForm = this.fb.group({
          code: ['ASC:' + this.pad(id, 3), [Validators.required]],
          type: [this.questionGroup?.questionTypeId, [Validators.required]],
          name: [this.questionGroup?.name, [Validators.required]],
          isDefault: [this.questionGroup?.isDefaultWO, [Validators.required]],
        });
        this.questionsForm = this.fb.group({
          questions: this.fb.array([])
        });
        this.generalForm.valueChanges.subscribe(data => {
          if (this.isEditable) {
            let saveButton = this.buttons.find(button => button.id === 'Save');
            if (saveButton) {
              saveButton.isDisabled = !this.generalForm.valid;
            }
          }
        });
        this.masterData['answers'] = questionData.answers;
        this.masterData['types'] = questionData.questionTypes;
        this.filteredData = {...this.masterData};
        if (this.qId > 0) {
          questionData?.questions?.forEach((question: any) => {
            this.addQuestion(question);
          });
          this.canAdd = true;
        }
      },
      error: (e) => {
        this.alertService.error('Error Retrieving HSEQ Question Group !!', {
          id: 'hesq-questions'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  get questions() {
    return this.questionsForm.controls["questions"] as FormArray;
  }

  addQuestion(question?: any) {
    const questionForm = this.fb.group({
      id: [question?.id ?? 0],
      question: [question?.name, Validators.required],
      answer: [FormatHelper.tokenizeWithData(question?.applicableAnswers?.join() ?? '1,2,3', this.masterData.answers), Validators.required]
    });
    this.questionDetails.push({
      id: question?.id ?? 0,
      question: question?.name ?? '',
      answer: FormatHelper.tokenizeWithData(question?.applicableAnswers?.join() ?? '1,2,3', this.masterData.answers)
    });
    this.questions.push(questionForm);
  }

  buttonClicked(buttonType: any): void {
    if ((buttonType == 'Save')) {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_HSEQ_GRID]);
    }
  }

  override save(): void {
    let group = this.generalForm.value;
    let questionGroup = {
      id: this.qId,
      name: group.name,
      questionTypeId: group.type?.id,
      questionTypeName: this.masterData.types.find((t: any) => t.id === group.type)?.name,
      isDefaultWO: group.isDefault ? 1 : 0
    }
    this.apiService.AddOrUpdateHSEQuestions('HSEQ/AddOrUpdateQuestionGroup', questionGroup).subscribe({
      next: (result) => {
        if(result > 0) {
          if (this.qId === 0) {
            this.qId = result;
            this.canAdd = true;
          }
          this.alertService.success('HSEQ Questions Updated Successfully !!', {id: 'hesq-questions'});
        } else if(result === -3){
          this.alertService.success('Default HSEQ Questions already Exists !!', {id: 'hesq-questions'});
        }
      },
      error: (e) => {
        this.alertService.error('Error Updating HSEQ Questions !!', {
          id: 'hesq-questions'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  updateAnswer(event: any, index: any): void {
    this.questionDetails[index].answer = event;
  }

  saveOrUpdate(index: any, question: any) {
    if (question.valid) {
      let form = question.value;
      let questionDetails = {
        id: form.id,
        name: form.question,
        groupId: this.qId,
        applicableAnswers: this.questionDetails[index].answer?.map((a: any) => a.value)
      }
      this.apiService.AddOrUpdateHSEQuestions('HSEQ/AddOrUpdateQuestion', questionDetails).subscribe({
        next: (result) => {
          this.alertService.success('Question saved successfully !!', {
            id: 'hesq-questions'
          });
        },
        error: (e) => {
          this.alertService.error('Error Updating HSEQ Questions !!', {
            id: 'hesq-questions'
          });
          console.error(e);
        },
        complete: () => { }
      });
    }
  }

  delete(index: number, question: any) {
    this.questions.removeAt(index);
    let form = question.value;
    this.apiService.DeleteQuestion('HSEQ/AddOrUpdateQuestion/' + form.id).subscribe({
      next: (result) => {
        this.alertService.success('Question successfully deleted !!', {
          id: 'hesq-questions'
        });
      },
      error: (e) => {
        this.alertService.error('Error Updating HSEQ Questions !!', {
          id: 'hesq-questions'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  getItemForm(form: any): FormGroup {
    return form as FormGroup;
  }

}
