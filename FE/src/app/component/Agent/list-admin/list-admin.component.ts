import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AgentService} from "../../../service/agent/agent.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageAgentAdmin} from "../../../model/agent/pageAgentAdmin";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import {ToastrService} from "ngx-toastr";
import {EmployeeService} from "../../../service/employee/employee.service";
import {Employees} from "../../../dto/employee/employees";
import {Agent} from "../../../model/agent/agent";

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {

  // @ts-ignore
  agentAll: Agent[];
  // @ts-ignore
  pageAgent: PageAgentAdmin;
  // @ts-ignore
  rfSearch: FormGroup;
  // @ts-ignore
  employees: Employees[];
  // @ts-ignore
  selectedEmployeeId: number | null = null;

  sortOrder: 'ASC' | 'DESC' = 'ASC';

  // @ts-ignore
  updateIds: number[];

  // @ts-ignore
  checkedAll: boolean;

  constructor(
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private employeeService : EmployeeService,
  ) { }

  ngOnInit(): void {
    this.searchForm();
    this.findAllAgents(0);
    this.updateIds = [];
    this.findAllEmployees();
    this.getAll();
  }

  // tslint:disable-next-line:typedef
  findAllAgents(pageNumber: number) {
    this.agentService.listAdmin(this.rfSearch.value, pageNumber).subscribe(
      data => {
        this.pageAgent = data;
      }
    );
  }


  findAllEmployees(){
    this.employeeService.ListEmployee().subscribe(
      data => {
        this.employees = data;
      }
    )
  }

  sortAgents() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.rfSearch.patchValue({
      sortType: this.sortOrder
    });
    // @ts-ignore
    this.findAllAgents(0, this.sortOrder);
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.rfSearch = this.formBuilder.group({
      name: [''],
      sortType:[''],
      employeeId: [],
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

  exportToExcel(): void {
    /* Tạo worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.pageAgent.content);

    /* Tạo workbook và thêm worksheet vào workbook */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Lưu vào file */
    XLSX.writeFile(wb, 'du-lieu-xuat-excel.xlsx');
  }

  addToUpdate(id: number) {
    const index = this.updateIds.indexOf(id, 0);
    index > -1 ? this.updateIds.splice(index, 1) : this.updateIds.push(id);
  }

  getAll(){
    this.agentService.getAll().subscribe(
      data =>{
        this.agentAll = data;
      }
    )
  }

  toggleAllCheckboxes() {
    this.checkedAll = !this.checkedAll;

    this.agentAll.forEach((item: any) => {
      this.addToUpdate(item.id);
    });

  }

  updateEmployees() {
    if (this.updateIds.length > 0) {
      if (this.selectedEmployeeId !== null) {
        this.agentService.updateEmployees(this.selectedEmployeeId = Number(this.selectedEmployeeId), this.updateIds).subscribe(
          data => {
            this.toast.success('Cập nhật thành công!');
            this.checkedAll = false;
          },
          error => {
            this.toast.error('Có lỗi khi cập nhật');
          },
          () => {
            this.ngOnInit();
          }
        );
      } else {
        this.toast.warning('Vui lòng chọn nhân viên để cập nhật.');
      }
    } else {
      this.toast.warning('Vui lòng chọn ít nhất một đại lý để cập nhật.');
    }
  }

  onEmployeeSelected(event: any) {
    this.selectedEmployeeId = event.target.value;
  }
}


