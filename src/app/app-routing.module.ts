import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Login',
    pathMatch: 'full'
  },
  {
    path: 'Login',
    component: LoginComponent
  },
  // {
  //   path: 'approval',
  //   component: QuoteApprovalComponent
  // },
  {
    path: 'Feedback/CaseClosed/:key',
    component: FeedbackComponent
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: '/GetDashBoard',
        pathMatch: 'full'
      },
      {
        path: 'GetDashBoard',
        component: DashboardComponent
      },
      {
        path: 'asset-register',
        loadChildren: () =>
          import('./components/asset-register/asset-register.module').then(
            (m) => m.AssetRegisterModule
          )
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('./components/corrective-calls/corrective-calls.module').then(
            (m) => m.CorrectiveCallsModule
          )
      },
      {
        path: 'reactive',
        loadChildren: () =>
          import('./components/reactive-calls/reactive-calls.module').then(
            (m) => m.ReactiveCallsModule
          )
      },
      {
        path: 'pm',
        loadChildren: () =>
          import('./components/ppm/ppm.module').then((m) => m.PpmModule)
      },
      {
        path: 'core',
        loadChildren: () =>
          import('./components/core/core.module').then((m) => m.CoreModule)
      },
      {
        path: 'stock-management',
        loadChildren: () =>
          import('./components/stock-management/stock-management.module').then(
            (m) => m.StockManagementModule
          )
      },
      {
        path: 'procurement',
        loadChildren: () =>
          import('./components/procurement/procurement.module').then(
            (m) => m.ProcurementModule
          )
      },
      {
        path: 'scheduled-tasks',
        loadChildren: () =>
          import('./components/scheduled-task/scheduled-task.module').then(
            (m) => m.ScheduledTaskModule
          )
      },
      {
        path: 'unit-pm',
        loadChildren: () =>
          import('./components/unit-pm/unit-pm.module').then(
            (m) => m.UnitPmModule
          )
      },
      // {
      //   path: 'quotation',
      //   loadChildren: () =>
      //     import('./components/quotation/quotation.module').then(
      //       (m) => m.QuotationModule
      //     )
      // },
      {
        path: 'hrms',
        loadChildren: () =>
          import('./components/hrms/hrms.module').then((m) => m.HrmsModule)
      },
      {
        path: 'work-permit-management',
        loadChildren: () =>
          import('./components/wpm/wpm.module').then((m) => m.WpmModule)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./components/reports/reports.module').then(
            (m) => m.ReportsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
