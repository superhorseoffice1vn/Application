import { Component, OnInit } from '@angular/core';
import {PageForm} from "../../../model/user/PageList";
import {EmployeeService} from "../../../service/employee/employee.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import * as XLSX from "xlsx";
import {EmployeeDto} from "../../../dto/employee/employeeDto";
import {TokenService} from "../../../service/security/token.service";
import {Title} from "@angular/platform-browser";

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
  rfSearch: FormGroup;

  // @ts-ignore
  sortType: string;

  // @ts-ignore
  checkedAll: boolean = false;

  sortOrder: 'ASC' | 'DESC' = 'ASC';


  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
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

  exportToExcel(): void {

    const fieldMappings = [
      { fieldName: 'name', excelName: 'Họ và Tên' },
      { fieldName: 'phoneNumber', excelName: 'Số Điện Thoại' },
      { fieldName: 'username', excelName: 'Tài khoản' },
    ];

    const exportedData = this.employeeList.content.map(item => {
      const mappedItem: any = {};
      fieldMappings.forEach(mapping => {
        // @ts-ignore
        mappedItem[mapping.excelName] = item[mapping.fieldName];
      });
      return mappedItem;
    });
    /* Tạo worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

    /* Tạo workbook và thêm worksheet vào workbook */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách nhân viên');

    /* Lưu vào file */
    XLSX.writeFile(wb, 'du-lieu-xuat-excel.xlsx');
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
      /* Tạo worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

      /* Tạo workbook và thêm worksheet vào workbook */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách nhân viên');

      /* Lưu vào file */
      XLSX.writeFile(wb, 'du-lieu-xuat-excel.xlsx');
    }
  }

  toggleAllCheckboxes() {
    this.employeeList.content.forEach((item: any) => {
      item.isChecked = this.checkedAll;
    });
  }
}
