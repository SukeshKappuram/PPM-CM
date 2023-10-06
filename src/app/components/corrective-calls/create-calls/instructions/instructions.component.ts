import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  instructionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.instructionForm = fb.group({
      instructions: [],
      itemNo: [],
      itemName: []
    });
  }
}
