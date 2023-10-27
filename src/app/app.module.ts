import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';

// import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountsComponent } from './components/auth/accounts/accounts.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthModule } from './components/auth/auth.module';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ThemeService } from './services/theme.service';
import { SharedModule } from './shared/shared.module';

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
    AngularEditorModule,
    // AgmCoreModule.forRoot({
    //   apiKey: ''
    // })
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
