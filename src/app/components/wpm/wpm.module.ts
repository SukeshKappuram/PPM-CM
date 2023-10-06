import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { LogComponent } from './log/log.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WpmComponent } from './wpm.component';
import { WpmRoutingModule } from './wpm.routing.module';

@NgModule({
  imports: [
    CommonModule,
    WpmRoutingModule,
    SharedModule
  ],
  declarations: [WpmComponent, LogComponent, GridComponent]
})
export class WpmModule { }
