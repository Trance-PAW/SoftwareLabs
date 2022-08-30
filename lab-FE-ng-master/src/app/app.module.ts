import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './layout/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { TableModule, Table } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';

import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { GuardService } from './services/guard.service';
import { FilesComponent } from './components/files/files.component';
import { CleanComponent } from './layout/clean/clean.component';
import { LoggerComponent } from './components/logger/logger.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './layout/main/nav/nav.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './layout/main/header/header.component';
import { UserComponent } from './components/settings/user/user.component';
import { UserListComponent } from './components/settings/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    FilesComponent,
    CleanComponent,
    LoggerComponent,
    LoginComponent,
    NavComponent,
    SettingsComponent,
    HeaderComponent,
    UserComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    ChartModule,
    CalendarModule,
    TableModule,
    FileUploadModule,
    ProgressSpinnerModule,
    InputSwitchModule,
  ],
  providers: [
    GuardService,
    DataService,
    AuthService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
