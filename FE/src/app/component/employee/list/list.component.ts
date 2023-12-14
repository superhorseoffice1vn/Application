import { Component, OnInit } from '@angular/core';
import {PageForm} from "../../../model/user/PageList";
import {EmployeeService} from "../../../service/employee/employee.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // @ts-ignore
  employeeList: PageForm;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.findAllForm(0)
  }

  // tslint:disable-next-line:typedef
  findAllForm(pageNumber: number) {
    this.employeeService.employeeList(pageNumber).subscribe(
      data => {
        this.employeeList = data;
      },
    );
  }

  // tslint:disable-next-line:typedef
  gotoPage(pageNumber: number) {
    this.findAllForm(pageNumber);
  }

}
