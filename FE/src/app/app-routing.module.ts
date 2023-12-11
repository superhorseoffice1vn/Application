import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {LoginService} from "./security/guard/login.service";
import {SignupComponent} from "./security/signup/signup.component";
import {AdminService} from "./security/guard/admin.service";
import {SidebarComponent} from "./component/sidebar/sidebar.component";
import {ListComponent} from "./component/employee/list/list.component";
import {DetailComponent} from "./component/employee/detail/detail.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent, canActivate: [AdminService]},
  {path: 'listEmployee', component: ListComponent, canActivate: [AdminService]},
  {path: 'detail', component: DetailComponent},
  {path: 'sidebar', component: SidebarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
