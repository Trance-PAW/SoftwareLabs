import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { LoggerComponent } from '@components/logger/logger.component';
import { CleanComponent } from './layout/clean/clean.component';
import { LoginComponent } from '@components/login/login.component';
import { SettingsComponent } from '@components/settings/settings.component';
import { UserListComponent } from '@components/settings/user-list/user-list.component';
import { UserComponent } from '@components/settings/user/user.component';
import { FilesComponent } from './components/files/files.component';

import { GuardService } from '@services/guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: CleanComponent, children: [
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: '', component: MainComponent, children: [
      { path: 'home', component: LoggerComponent, canActivate: [GuardService], data: { adminNotAllowed: true } },
      { path: 'dashboard', component: DashboardComponent, canActivate: [GuardService], data: { role: 1 } },
      { path: 'database', component: FilesComponent, canActivate: [GuardService], data: { role: 0 } },
      {
        path: 'settings', component: SettingsComponent, canActivate: [GuardService], data: { role: 0 }, children: [
          { path: '', redirectTo: 'user-list', pathMatch: 'full' },
          { path: 'user-list', component: UserListComponent, canActivate: [GuardService], data: { role: 0 } },
          { path: 'create-user', component: UserComponent, canActivate: [GuardService], data: { role: 0 } },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
