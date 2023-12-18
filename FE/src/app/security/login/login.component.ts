import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../service/security/auth.service";
import {TokenService} from "../../service/security/token.service";
import {MessageRespone} from "../../model/security/message-respone";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
// @ts-ignore
  rfLogin: FormGroup;
  passwordVisible: boolean = false;
  eyeIcon: string = 'bx bx-hide';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.getFormLogin();
  }

  getFormLogin(): void {
    this.rfLogin = this.formBuilder.group({
      username: [''],
      password: [''],
      rememberMe: [false]
    });
  }

  login(): void {
    this.authService.login(this.rfLogin.value).subscribe(data => {
      console.log("lỗi rồi")
      if (data.token !== undefined) {

        if (this.rfLogin.value.rememberMe) {
          this.tokenService.rememberMe(data.token, data.account, data.roles, data.user);
        } else {
          this.tokenService.setAccountSession(data.account);
          this.tokenService.setTokenSession(data.token);
          this.tokenService.setUserSession(data.user);
          this.tokenService.setRoleSession(data.roles);
        }
        const roles = this.tokenService.getRole();
        for (let i = 0; i < roles.length; i++) {
          if (roles[i] === 'ROLE_ADMIN') {
            this.router.navigate(['/agentsAdmin']).then(() => {
              location.reload();
            });
          }
          else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/agentsEmployee']).then(() => {
              location.reload();
            });
          }
        }

      }
      this.toastr.success('Đăng nhập thành công');
    }, error => {
      const messageRespone: MessageRespone = error;
      if (messageRespone.message) {
        this.toastr.error('Tài khoản hoặc mật khẩu không hợp lệ');

        this.router.navigateByUrl('');
      } else {
        this.toastr.error('Tài khoản hoặc mật khẩu không hợp lệ');

        this.router.navigateByUrl('');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.eyeIcon = this.passwordVisible ? 'bx bx-show' : 'bx bx-hide';
  }

}
