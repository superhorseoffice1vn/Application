import { Component, OnInit } from '@angular/core';
import {PageAgentEmployee} from "../../../model/agent/pageAgentEmployee";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AgentService} from "../../../service/agent/agent.service";
import {TokenService} from "../../../service/security/token.service";
import {User} from "../../../model/user/user";

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  // @ts-ignore
  pageAgent: PageAgentEmployee;
  // @ts-ignore
  rfSearch: FormGroup;

  // @ts-ignore
  currentUser: User;

  constructor(
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.searchForm();
    this.findAllAgents(0);
  }

  // tslint:disable-next-line:typedef
  findAllAgents(pageNumber: number) {
    this.agentService.listEmployee(this.rfSearch.value, pageNumber).subscribe(
      data => {
        this.pageAgent = data;
      }
    );
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.currentUser = JSON.parse(this.tokenService.getUser());
    this.rfSearch = this.formBuilder.group({
      id:[this.currentUser.id],
      nameAgent: ['']
    });
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.findAllAgents(pageNumber);
  }

}
