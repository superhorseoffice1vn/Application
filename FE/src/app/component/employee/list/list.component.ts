import { Component, OnInit } from '@angular/core';
import {PageForm} from "../../../model/user/PageList";
import {EmployeeService} from "../../../service/employee/employee.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import * as XLSX from "xlsx";
import {EmployeeDto} from "../../../dto/employee/employeeDto";
import {TokenService} from "../../../service/security/token.service";
import {Title} from "@angular/platform-browser";
import {AgentsAdmin} from "../../../dto/agent/agentsAdmin";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // @ts-ignore
  employeeList: PageForm;

  // @ts-ignore
  employees: EmployeeDto;

  // @ts-ignore
  listEmployees: EmployeeDto[] = [];

  // @ts-ignore
  rfSearch: FormGroup;

  // @ts-ignore
  sortType: string;

  // @ts-ignore
  checkedAll: boolean = false;

  // @ts-ignore
  addIds: number[] = [];

  sortOrder: 'ASC' | 'DESC' = 'ASC';


  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private toast: ToastrService,
              private _titleService: Title) {
    this._titleService.setTitle("Quản lý nhân viên")
  }

  ngOnInit(): void {
    this.searchForm();
    this.findAllForm(0)
    this.allEmployee();
  }

  // tslint:disable-next-line:typedef
  findAllForm(pageNumber: number) {
    this.employeeService.employeeList(this.rfSearch.value, pageNumber).subscribe(
      data => {
        this.employeeList = data;
      },
    );
  }

  allEmployee(){
    this.employeeService.employees().subscribe(
      employee =>{
        this.employees = employee;
      }
    )
  }

  sortAgents() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.rfSearch.patchValue({
      sortType: this.sortOrder
    });
    // @ts-ignore
    this.findAllForm(0, this.sortOrder);
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
    this.findAllForm(pageNumber);
  }

  exportToExcelAll(): void {

    const fieldMappings = [
      {fieldName: 'name', excelName: 'Họ và Tên'},
      {fieldName: 'phoneNumber', excelName: 'Số Điện Thoại'},
      {fieldName: 'username', excelName: 'Tài khoản'},
    ];

    if (Array.isArray(this.employees)) {
      const exportedData = this.employees.map((item: EmployeeDto) => {
        const mappedItem: any = {};
        fieldMappings.forEach(mapping => {
          // @ts-ignore
          mappedItem[mapping.excelName] = item[mapping.fieldName];
        });
        return mappedItem;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách nhân viên');

      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      const fileName = `${year}${month}${day}_${hours}${minutes}_danh-sach-nhan-vien-excel.xlsx`;

      XLSX.writeFile(wb, fileName);
    }
  }

  toggleAllCheckboxes() {
    this.employeeList.content.forEach((item: any) => {
      item.isChecked = this.checkedAll;
    });
  }

  listEmployeeSelect(){
    this.employeeService.listEmployees(this.addIds).subscribe(
      data => {
        this.listEmployees = data;
      }
    )
  }

  add(id: number) {
    const index = this.addIds.indexOf(id);

    if (index > -1) {
      this.addIds.splice(index, 1);
    } else {
      this.addIds.push(id);
    }

    if (this.addIds.length > 0) {
      this.listEmployeeSelect();
    } else {
      this.listEmployees = [];
    }
  }

  remove(addIds: number[]): void {
    Swal.fire({
      title: 'Bạn Có Muốn Xóa?',
      text: 'Các nhân viên đã chọn ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#BBBBBB',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.remove(addIds).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Xóa Thành Công ',
            showConfirmButton: false,
            timer: 2000
          });
          this.listEmployees = [];
          this.addIds = [];
          this.ngOnInit();
        }, error => {
          this.toast.warning('Vui lòng chọn nhân viên để xoá.');
        });
      }
    });
  }
}
