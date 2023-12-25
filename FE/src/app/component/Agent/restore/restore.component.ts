import { Component, OnInit } from '@angular/core';
import {AgentService} from "../../../service/agent/agent.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {PageAgentAdmin} from "../../../model/agent/pageAgentAdmin";
import {AgentsAdmin} from "../../../dto/agent/agentsAdmin";
import Swal from "sweetalert2";

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {

  // @ts-ignore
  rfSearch: FormGroup;
  // @ts-ignore
  pageAgentRestore: PageAgentAdmin;
  // @ts-ignore
  checkedAll: boolean;
  // @ts-ignore
  updateIds: number[] = [];
  // @ts-ignore
  listAgent: AgentsAdmin[]

  constructor(
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private _titleService: Title) {
    this._titleService.setTitle("Danh sách đã xoá")
  }

  ngOnInit(): void {
    this.searchForm();
    this.listAdminRestore(0);
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.rfSearch = this.formBuilder.group({
      name: [''],
    });
  }

  listAdminRestore(pageNumber: number){
    this.agentService.listRestore(this.rfSearch.value,pageNumber).subscribe(
      data => {
        this.pageAgentRestore = data;
      }
    )
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.listAdminRestore(pageNumber);
  }

  listAgentSelect(){
    this.agentService.listAgentRestore(this.updateIds).subscribe(
      data => {
        this.listAgent = data;
      }
    )
  }

  addToUpdate(id: number) {
    const index = this.updateIds.indexOf(id);

    if (index > -1) {
      this.updateIds.splice(index, 1);
    } else {
      this.updateIds.push(id);
    }

    if (this.updateIds.length > 0) {
      this.listAgentSelect();
    } else {
      this.listAgent = [];
    }
  }

  restore(updateIds: number[]): void {
    Swal.fire({
      title: 'Bạn Có Muốn Khôi Phục?',
      text: 'Các đại lí đã chọn ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#BBBBBB',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService.restore(updateIds).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Khôi phục thành công ',
            showConfirmButton: false,
            timer: 2000
          });
          this.listAgent = [];
          this.ngOnInit();
        }, error => {
          this.toast.warning('Vui lòng chọn nhân viên để khôi phục.');
        });
      }
    });
  }

}
