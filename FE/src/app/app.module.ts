import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { SignupComponent } from './security/signup/signup.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import { ListComponent } from './component/employee/list/list.component';
import { DetailComponent } from './component/employee/detail/detail.component';
import { CreateComponent } from './component/Agent/create/create.component';
import { ListEmployeeComponent } from './component/Agent/list-employee/list-employee.component';
import { ListAdminComponent } from './component/Agent/list-admin/list-admin.component';
import { EditComponent } from './component/Agent/edit/edit.component';
import { EditEmployeeComponent } from './component/employee/edit-employee/edit-employee.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    ListComponent,
    DetailComponent,
    CreateComponent,
    ListEmployeeComponent,
    ListAdminComponent,
    EditComponent,
    EditEmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
