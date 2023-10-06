import { BrowserModule, Title } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AccountsComponent } from './components/auth/accounts/accounts.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { AuthModule } from './components/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FormsModule } from '@angular/forms';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { ThemeService } from './services/theme.service';

@NgModule({
  declarations: [AppComponent, AuthComponent, AccountsComponent, FeedbackComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    AuthModule,
    MatAutocompleteModule,
    AngularEditorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    ThemeService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
