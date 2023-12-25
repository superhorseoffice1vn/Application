import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {LoginService} from "./security/guard/login.service";
import {SignupComponent} from "./security/signup/signup.component";
import {AdminService} from "./security/guard/admin.service";
import {SidebarComponent} from "./component/sidebar/sidebar.component";
import {ListComponent} from "./component/employee/list/list.component";
import {DetailComponent} from "./component/employee/detail/detail.component";
import {CreateComponent} from "./component/Agent/create/create.component";
import {ListEmployeeComponent} from "./component/Agent/list-employee/list-employee.component";
import {ListAdminComponent} from "./component/Agent/list-admin/list-admin.component";
import {EditComponent} from "./component/Agent/edit/edit.component";
import {EditEmployeeComponent} from "./component/employee/edit-employee/edit-employee.component";
import {RestoreComponent} from "./component/Agent/restore/restore.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent, canActivate: [AdminService]},
  {path: 'listEmployee', component: ListComponent, canActivate: [AdminService]},
  {path: 'listRestore', component: RestoreComponent, canActivate: [AdminService]},
  {path: 'detail', component: DetailComponent},
  {path: 'sidebar', component: SidebarComponent},
  {path: 'createAgent', component: CreateComponent},
  {path: 'agentsEmployee', component: ListEmployeeComponent},
  {path: 'agentsAdmin', component: ListAdminComponent, canActivate: [AdminService]},
  {path: 'editAgent/:id', component: EditComponent},
  {path: 'editEmployee/:id', component: EditEmployeeComponent, canActivate: [AdminService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
