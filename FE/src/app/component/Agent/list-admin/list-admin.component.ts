import { Component, OnInit } from '@angular/core';
import {AgentService} from "../../../service/agent/agent.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageAgentEmployee} from "../../../model/agent/pageAgentEmployee";
import {PageAgentAdmin} from "../../../model/agent/pageAgentAdmin";
import Swal from "sweetalert2";

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

  sortOrder: 'ASC' | 'DESC' = 'ASC';

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
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';

    // Update the form with the sorting information
    this.rfSearch.patchValue({
      sortType: this.sortOrder
    });
  }

  sortAgents() {
    // Call the findAllAgents method to trigger sorting
    this.findAllAgents(0);
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.rfSearch = this.formBuilder.group({
      name: [''],
      sortType:['']
    });
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
