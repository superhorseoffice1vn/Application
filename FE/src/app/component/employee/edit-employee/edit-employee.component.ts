import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AgentService} from "../../../service/agent/agent.service";
import {TokenService} from "../../../service/security/token.service";
import {UserService} from "../../../security/guard/user.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {User} from "../../../model/user/user";
import {EmployeeService} from "../../../service/employee/employee.service";
import {Account} from "../../../model/user/account";
import {UpdateEmployee} from "../../../model/user/updateEmployee";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  id: number | undefined;
  // @ts-ignore
  employee: UpdateEmployee;
  // @ts-ignore
  account: Account;
  // @ts-ignore
  formEditEmployee: FormGroup;

  data: any = {
    message: 'The username existed! Please try again!'
  };

  constructor(private formBuilder: FormBuilder,
              private tokenService: TokenService,
              private userService: UserService,
              private employeeService: EmployeeService,
              private activatedRoute: ActivatedRoute,
              private toast: ToastrService,
              private router: Router,
              private _titleService: Title) {
    this._titleService.setTitle("Chỉnh sửa nhân viên")
  }

  ngOnInit(): void {
    this.getFormEdit();
    this.formEditEmployee = this.formBuilder.group({
      name: [''],
      phoneNumber: [''],
      username: [''],
      password: [''],
    });
  }

  getFormEdit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      // @ts-ignore
      this.id = +paramMap.get("id");
      this.employeeService.employeeById(this.id).subscribe(employee => {
        this.employee = employee;
        this.formEditEmployee = this.formBuilder.group({
          name: [employee.name, [Validators.required]],
          phoneNumber: [employee.phoneNumber, [Validators.required]],
          username: [employee.username, [Validators.required]],
          password: ["",[Validators.required]],
        });
      }, error => {
        this.toast.error("Lỗi trang !")
      });
    });
  }

  updateProduct(id: any) {
    this.employeeService.updateEmployee(this.formEditEmployee.value,id).subscribe(
      // @ts-ignore
      data => {
        if (JSON.stringify(data) == JSON.stringify(this.data)) {
          this.toast.error('Tài khoản đã tồn tại!');
          return this.router.navigateByUrl('/editEmployee');
        }
        this.toast.success('Chỉnh sửa thành công');
        this.router.navigateByUrl('/listEmployee');
      },
      error => {
        this.toast.error('Lỗi khi cập nhật nhân viên!');
      }
    );
  }

}
