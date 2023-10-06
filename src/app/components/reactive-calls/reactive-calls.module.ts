import { CommonModule } from '@angular/common';
import { CorrectiveCallsModule } from './../corrective-calls/corrective-calls.module';
import { NgModule } from '@angular/core';
import { ReactiveCallsRoutingModule } from './reactive-calls-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveCallsRoutingModule, CorrectiveCallsModule]
})
export class ReactiveCallsModule {}
