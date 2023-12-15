import { Component, OnInit } from '@angular/core';
import {PageAgentEmployee} from "../../../model/agent/pageAgentEmployee";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AgentService} from "../../../service/agent/agent.service";
import {TokenService} from "../../../service/security/token.service";
import {User} from "../../../model/user/user";
import Swal from "sweetalert2";

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

  sortOrder: 'ASC' | 'DESC' = 'ASC';

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
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';

    // Update the form with the sorting information
    this.rfSearch.patchValue({
      sortType: this.sortOrder
    });
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.currentUser = JSON.parse(this.tokenService.getUser());
    this.rfSearch = this.formBuilder.group({
      id:[this.currentUser.id],
      name: [''],
      sortType:['']
    });
    console.log(this.rfSearch)
  }

  sortAgents() {
    // Call the findAllAgents method to trigger sorting
    this.findAllAgents(0);
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.findAllAgents(pageNumber);
  }

  delete(id: number, name: string): void {
    Swal.fire({
      title: 'Bạn Có Muốn Xóa?',
      text: 'Tên đại lí: ' + name + ' Không ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#BBBBBB',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService.delete(id).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Xóa Thành Công ',
            showConfirmButton: false,
            timer: 2000
          });
          this.ngOnInit();
        }, error => {
          console.log(error);
        });
      }
    });
  }

}
