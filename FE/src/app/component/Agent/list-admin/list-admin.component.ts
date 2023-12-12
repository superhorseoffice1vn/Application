import { Component, OnInit } from '@angular/core';
import {AgentService} from "../../../service/agent/agent.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageAgentEmployee} from "../../../model/agent/pageAgentEmployee";
import {PageAgentAdmin} from "../../../model/agent/pageAgentAdmin";

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {

  // @ts-ignore
  pageAgent: PageAgentAdmin;
  // @ts-ignore
  rfSearch: FormGroup;

  constructor(
    private agentService: AgentService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.searchForm();
    this.findAllAgents(0);
  }

  // tslint:disable-next-line:typedef
  findAllAgents(pageNumber: number) {
    this.agentService.listAdmin(this.rfSearch.value, pageNumber).subscribe(
      data => {
        this.pageAgent = data;
      }
    );
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.rfSearch = this.formBuilder.group({
      nameEmployee: ['']
    });
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.findAllAgents(pageNumber);
  }

}
