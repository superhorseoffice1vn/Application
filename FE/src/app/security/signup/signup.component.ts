import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/security/auth.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";
import {TokenService} from "../../service/security/token.service";

export const checkBirthDay: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // @ts-ignore
  const birthday = new Date(control.get('birthDay').value).getTime();
  const dateNow = new Date().getTime();
  if (dateNow - birthday < 18 * 365 * 24 * 60 * 60 * 1000 || dateNow - birthday > 100 * 365 * 24 * 60 * 60 * 1000) {
    return {checkBirthDay: true};
  } else {
    return null;
  }
};

export const reConfirmPass: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.touched && password.value !== confirmPassword.value) {
    return {reConfirmPass: true};
  } else {
    return null;
  }
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // @ts-ignore
  rfAddUser: FormGroup;

  genderOptions = ['Nam', 'Nữ'];
  idTypeUserOptions = [
    { value: 1, label: 'Nhân viên' },
    { value: 2, label: 'Sale' },
  ];

  data: any = {
    message: 'Create user success!'
  };

  status = '';

  constructor(
    private authService: AuthService,
    private builder: FormBuilder,
    private toast: ToastrService,
    private tokenService: TokenService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createUser();
  }

  createUser(): void {
    this.rfAddUser = this.builder.group({
        name: ['',[Validators.required,
          Validators.pattern('^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKL' +
            'MNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]' +
            '[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]' +
            '+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]' +
            '[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+' +
            '(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]' +
            '[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*$'),
          Validators.maxLength(50),
          Validators.minLength(5)]],
        birthDay: ['',[Validators.required]],
        idCard: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        idUserType: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],
        username: ['',[Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)]],
        password: ['', [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)]],
        confirmPassword: ['']
      },{validators: [checkBirthDay, reConfirmPass]}
    );
  }

  create(): void {
    if (this.rfAddUser?.valid) {
      this.authService.createUser(this.rfAddUser?.value).subscribe(
        data => {
          // tslint:disable-next-line:triple-equals
          if (!(JSON.stringify(data) == JSON.stringify(this.data))) {
            this.toast.error('Đăng ký thất bại');
          }
          // tslint:disable-next-line:triple-equals
          if (JSON.stringify(data) == JSON.stringify(this.data)) {
            this.status = 'Đăng ký thành công';
            this.toast.success('Đăng ký thành công');
            this.router.navigateByUrl('/signup');
            this.resetFormAndData();
          }
        }
      );
    }
  }

  resetFormAndData(): void {
    this.ngOnInit();
  }
  checkUsername(username: string) {
    this.authService.checkUsername(username).subscribe(
      next => {
        if (next == true) {
          // @ts-ignore
          this.rfAddUser.controls.username.setErrors({'invalidUsername': true});
        }
      }
    );
  }

}
