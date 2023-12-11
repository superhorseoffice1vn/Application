import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../../service/employee/employee.service";
import {TokenService} from "../../../service/security/token.service";
import {FormBuilder} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import Swal from 'sweetalert2';
import {User} from "../../../model/user/user";
import {UserDetail} from "../../../model/user/user-detail";
import {Account} from "../../../model/user/account";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  // @ts-ignore
  detailUser: UserDetail;
  // @ts-ignore
  rfPassword: FormGroup;
  // @ts-ignore
  account: Account;

  constructor(
    private employeeService: EmployeeService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.detail();
    this.getChangePassword();
  }

  // tslint:disable-next-line:typedef
  detail() {
    console.log(this.detailUser)
    this.detailUser = JSON.parse(this.tokenService.getUser());
    // @ts-ignore
    this.employeeService.detailUser(this.detailUser.id).subscribe(data => {
      this.detailUser = data;
    });
  }

  getChangePassword(): void {
    this.account = JSON.parse(this.tokenService.getAccount())
    this.rfPassword = this.formBuilder.group({
      confirmPassword: [''],
      password: [''],
      newPassword: [''],
      username: [this.account.username]
    });
  }
  passwordError = '';
  newPasswordError = '';
  confirmPasswordError = '';
  op: boolean | undefined;
  np: boolean | undefined;
  cp: boolean | undefined;
  changePassword() {
    this.passwordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.employeeService.changePassword(this.rfPassword.value).subscribe(
      next => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Chúc mừng đã cập nhật mật khẩu thành công',
          showConfirmButton: false,
          timer: 2500
        })
        // @ts-ignore
        document.getElementById('dismiss2').click()
        this.getChangePassword();
      }, error => {
        console.log(error)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Thay đổi mật khẩu thất bại',
          showConfirmButton: false,
          timer: 2500
        })
        for (let i = 0; i < error.error.length; i++) {
          if (error.error[i].field == 'password') {
            this.passwordError = error.error[i].defaultMessage;
          } else if (error.error[i].field == 'newPassword') {
            this.newPasswordError = error.error[i].defaultMessage;
          } else if (error.error[i].field == 'confirmPassword') {
            this.confirmPasswordError = error.error[i].defaultMessage;
          }
        }
      }
    )
  }

  oldPassword() {
    this.op = !this.op;

  }

  newPassword() {
    this.np = !this.np;

  }

  confirmPassword() {
    this.cp = !this.cp;

  }
}
