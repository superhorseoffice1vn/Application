import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AgentService} from "../../../service/agent/agent.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TokenService} from "../../../service/security/token.service";
import {User} from "../../../model/user/user";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  // @ts-ignore
  rfAddAgent: FormGroup;

  // @ts-ignore
  currentUser: User;

  data: any = {
    message: 'Create agent success!'
  };

  status = '';

  constructor(
    private agentService: AgentService,
    private tokenService: TokenService,
    private builder: FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createAgent();
  }

  createAgent(): void {
    this.currentUser = JSON.parse(this.tokenService.getUser());
    this.rfAddAgent = this.builder.group({
        nameAgent:['', [Validators.required]],
        nameUser:['', [Validators.required]],
        phoneNumber:['', [Validators.required]],
        address:['', [Validators.required]],
        locationGoogleMap:['', [Validators.required]],
        idUser:[this.currentUser.id]
      },
    );
  }

  create(): void {
    if (this.rfAddAgent?.valid) {
      this.agentService.createAgent(this.rfAddAgent?.value).subscribe(
        data => {
          // tslint:disable-next-line:triple-equals
          if (!(JSON.stringify(data) == JSON.stringify(this.data))) {
            this.toast.error('Thêm mới thất bại');
          }
          // tslint:disable-next-line:triple-equals
          if (JSON.stringify(data) == JSON.stringify(this.data)) {
            this.status = 'Thêm mới thành công';
            this.toast.success('Thêm mới thành công');
            this.router.navigateByUrl('/agentsEmployee');
            this.resetFormAndData();
          }
        }
      );
    }
  }

  resetFormAndData(): void {
    this.ngOnInit();
  }

}
