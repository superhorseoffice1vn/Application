import { Component, OnInit } from '@angular/core';
import {PageForm} from "../../../model/user/PageList";
import {EmployeeService} from "../../../service/employee/employee.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // @ts-ignore
  employeeList: PageForm;

  // @ts-ignore
  rfSearch: FormGroup;

  sortOrder: 'ASC' | 'DESC' = 'ASC';

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.searchForm();
    this.findAllForm(0)
  }

  // tslint:disable-next-line:typedef
  findAllForm(pageNumber: number) {
    this.employeeService.employeeList(this.rfSearch.value, pageNumber).subscribe(
      data => {
        this.employeeList = data;
      },
    );
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';

    // Update the form with the sorting information
    this.rfSearch.patchValue({
      sortType: this.sortOrder
    });
  }

  sortAgents() {
    // Call the findAllAgents method to trigger sorting
    this.findAllForm(0);
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

}
