import { Component, OnInit } from '@angular/core';
import {AgentService} from "../../../service/agent/agent.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageAgentAdmin} from "../../../model/agent/pageAgentAdmin";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import {ToastrService} from "ngx-toastr";
import {EmployeeService} from "../../../service/employee/employee.service";
import {Employees} from "../../../dto/employee/employees";
import {Agent} from "../../../model/agent/agent";
import {EmployeeDto} from "../../../dto/employee/employeeDto";
import {AgentsAdmin} from "../../../dto/agent/agentsAdmin";
import {TokenService} from "../../../service/security/token.service";
import {Title} from "@angular/platform-browser";

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
  listAgent: AgentsAdmin[]
  // @ts-ignore
  rfSearch: FormGroup;
  // @ts-ignore
  employees: Employees[];
  // @ts-ignore
  selectedEmployeeId: number | null = null;

  sortOrder: 'ASC' | 'DESC' = 'ASC';

  // @ts-ignore
  updateIds: number[] = [];

  // @ts-ignore
  checkedAll: boolean;

  constructor(
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private employeeService : EmployeeService,
    private _titleService: Title) {
    this._titleService.setTitle("Quản lý đại lý")
  }

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

  listAgentSelect(){
    this.agentService.listAgent(this.updateIds).subscribe(
      data => {
        this.listAgent = data;
      }
    )
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

  exportToExcelAll(): void {

    const fieldMappings = [
      { fieldName: 'nameAgent', excelName: 'Tên đại lý' },
      { fieldName: 'nameUser', excelName: 'Họ và tên người liên lạc' },
      { fieldName: 'phoneNumber', excelName: 'Số điện thoại' },
      { fieldName: 'address', excelName: 'Địa chỉ' },
      { fieldName: 'user.name', excelName: 'Họ và tên nhân viên' },
    ];

    if (Array.isArray(this.agentAll)) {
      // @ts-ignore
      const exportedData = this.agentAll.map((item: EmployeeDto) => {
        const mappedItem: any = {};
        fieldMappings.forEach(mapping => {
          const fields = mapping.fieldName.split('.');
          let value = item;
          fields.forEach(field => {
            if (value && value.hasOwnProperty(field)) {
              // @ts-ignore
              value = value[field];
            } else {
              // @ts-ignore
              value = null;
            }
          });
          mappedItem[mapping.excelName] = value;
        });
        return mappedItem;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đại lý');

      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      const fileName = `${year}${month}${day}_${hours}${minutes}_danh-sach-dai-li-excel.xlsx`;

      XLSX.writeFile(wb, fileName);
    }
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

  getAll(){
    this.agentService.getAll().subscribe(
      data =>{
        this.agentAll = data;
      }
    )
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

  remove(updateIds: number[]): void {
    Swal.fire({
      title: 'Bạn Có Muốn Xóa?',
      text: 'Các đại lý đã chọn ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#BBBBBB',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService.remove(updateIds).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Xóa Thành Công ',
            showConfirmButton: false,
            timer: 2000
          });
          this.listAgent = [];
          this.ngOnInit();
        }, error => {
          this.toast.warning('Vui lòng chọn nhân viên để xoá.');
        });
      }
    });
  }

  onEmployeeSelected(event: any) {
    this.selectedEmployeeId = event.target.value;
  }
}


