import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {LoginService} from "./security/guard/login.service";
import {SignupComponent} from "./security/signup/signup.component";
import {AdminService} from "./security/guard/admin.service";
import {SidebarComponent} from "./component/sidebar/sidebar.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent, canActivate: [AdminService]},
  {path: 'sidebar', component: SidebarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
