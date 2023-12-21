import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AgentService} from "../../../service/agent/agent.service";
import {UserService} from "../../../security/guard/user.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Agent} from "../../../model/agent/agent";
import {TokenService} from "../../../service/security/token.service";
import {User} from "../../../model/user/user";
import {EmployeeService} from "../../../service/employee/employee.service";
import {Employees} from "../../../dto/employee/employees";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: number | undefined;
  // @ts-ignore
  agent: Agent;

  // @ts-ignore
  formEditAgent: FormGroup;

  // @ts-ignore
  employees: Employees[];

  checkLogin = false;
  nameAccount: any;
  // @ts-ignore
  currentUser: User;
  // @ts-ignore
  accountRole: string;



  constructor(
    private formBuilder: FormBuilder,
    private agentService: AgentService,
    private tokenService: TokenService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private employeeService : EmployeeService,
  ) { }

  ngOnInit(): void {
    this.checkRole();
    this.formEditAgent = this.formBuilder.group({
      nameAgent: [''],
      nameUser: [''],
      phoneNumber: [''],
      address: [''],
      locationGoogleMap: [''],
      idUser:[]
    });
    this.getFormEdit();
    this.findAllEmployees();
  }


  getFormEdit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      // @ts-ignore
      this.id = +paramMap.get("id");
      this.agentService.agentById(this.id).subscribe(agent => {
        this.agent = agent;
        this.formEditAgent = this.formBuilder.group({
          nameAgent: [agent.nameAgent, [Validators.required]],
          nameUser: [agent.nameUser, [Validators.required]],
          phoneNumber: [agent.phoneNumber, [Validators.required]],
          address: [agent.address, [Validators.required]],
          locationGoogleMap: [agent.locationGoogleMap, [Validators.required]],
          idUser: [agent.user.id]
        });
      }, error => {
        this.toast.error("Lỗi trang !")
      });
    });
  }

  updateProduct(id: any) {
      this.agentService.updateAgent(this.formEditAgent.value,id).subscribe(
        () => {
          this.toast.success('Chỉnh sửa thành công');
          const redirectPath = this.accountRole === 'ROLE_ADMIN' ? '/agentsAdmin' : '/agentsEmployee';

          this.router.navigateByUrl(redirectPath);
        },
        error => {
          this.toast.error('Lỗi khi cập nhật đại lý!');
        }
      );
  }
  onEmployeeChange(event: any) {
    this.formEditAgent.controls['idUser'].setValue(event.target.value);
  }

  findAllEmployees(){
    this.employeeService.ListEmployee().subscribe(
      data => {
        this.employees = data;
      }
    )
  }


  checkRole(){
    if (this.tokenService.isLogged()) {
      this.checkLogin = true;
      this.currentUser = JSON.parse(this.tokenService.getUser());
      this.nameAccount = this.currentUser.name;

      const roles = this.tokenService.getRole();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ROLE_ADMIN') {
          this.accountRole = 'ROLE_ADMIN';
        }
        else if (roles.includes('ROLE_USER')) {
          this.accountRole = 'ROLE_USER';
        }
      }
    }
  }
}
