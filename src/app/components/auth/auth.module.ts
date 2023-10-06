import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { IntlModule } from "@progress/kendo-angular-intl";
import { LabelModule } from "@progress/kendo-angular-label";
import { ChangePasswordComponent } from 'src/app/layout/header/change-password/change-password.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule,
    IntlModule,
    LabelModule,
    ButtonsModule,
    DateInputsModule],
  declarations: [
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ChangePasswordComponent
  ],
  exports: [HeaderComponent, SidebarComponent]
})
export class AuthModule {}
