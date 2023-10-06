import { RouterModule, Routes } from '@angular/router';

import { GridComponent } from './grid/grid.component';
import { LogComponent } from './log/log.component';
import { NgModule } from '@angular/core';
import { WpmComponent } from './wpm.component';

const routes: Routes = [
  {
    path: 'master',
    component: WpmComponent
  },
  {
    path: 'closewp',
    component: GridComponent,
    data: {
      url: 'TaskLog'
    }
  },
  {
    path: 'wplog',
    component: LogComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WpmRoutingModule {}
