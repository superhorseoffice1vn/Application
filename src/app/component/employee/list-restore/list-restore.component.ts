import { Component, OnInit } from '@angular/core';
import {EmployeeService} from "../../../service/employee/employee.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {PageForm} from "../../../model/user/PageList";
import {EmployeeDto} from "../../../dto/employee/employeeDto";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-restore',
  templateUrl: './list-restore.component.html',
  styleUrls: ['./list-restore.component.css']
})
export class ListRestoreComponent implements OnInit {

  // @ts-ignore
  rfSearch: FormGroup;

  // @ts-ignore
  employeeListRestore: PageForm;

  // @ts-ignore
  listEmployeesRestore: EmployeeDto[] = [];

  // @ts-ignore
  addIds: number[] = [];

  // @ts-ignore
  checkedAll: boolean;

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private toast: ToastrService,
              private _titleService: Title) {
    this._titleService.setTitle("Quản lý nhân viên")
  }

  ngOnInit(): void {
    this.searchForm();
    this.listEmployeeRestore(0)
  }

  // tslint:disable-next-line:typedef
  searchForm() {
    this.rfSearch = this.formBuilder.group({
      name: [''],
    });
  }

  listEmployeeRestore(pageNumber: number){
    this.employeeService.employeeListRestore(this.rfSearch.value,pageNumber).subscribe(
      data => {
        this.employeeListRestore = data;
      }
    )
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.listEmployeeRestore(pageNumber);
  }

  listEmployeeRestoreSelect(){
    this.employeeService.listEmployeesRestore(this.addIds).subscribe(
      data => {
        this.listEmployeesRestore = data;
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
      this.listEmployeeRestoreSelect();
    } else {
      this.listEmployeesRestore = [];
    }
  }

  restore(updateIds: number[]): void {
    Swal.fire({
      title: 'Bạn Có Muốn Khôi Phục?',
      text: 'Các nhân viên đã chọn ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#BBBBBB',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.restore(updateIds).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Khôi phục thành công ',
            showConfirmButton: false,
            timer: 2000
          });
          this.listEmployeesRestore = [];
          this.addIds = [];
          this.ngOnInit();
        }, error => {
          this.toast.warning('Vui lòng chọn nhân viên để khôi phục.');
        });
      }
    });
  }

}
