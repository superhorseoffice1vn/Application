import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TokenService} from "../security/token.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  api_url = 'http://localhost:8080/api/employee'

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) { }

  employeeList(search: any, pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.api_url + '/list' + '?page=' + pageNumber, search,{ headers });
  }

  employeeListRestore(search: any, pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.api_url + '/listRestore' + '?page=' + pageNumber, search,{ headers });
  }

  detailUser(id: number | undefined): Observable<any> {
    return this.httpClient.get<any>(this.api_url + '/detail/' + id);
  }

  changePassword(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/change-password',obj);
  }

  updateEmployee(employee: any, id: any): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put<any>(this.api_url + '/update/' + id, employee,{ headers });
  }

  employeeById(id: number | undefined): Observable<any> {
    return this.httpClient.get<any>(this.api_url + "/" + id);
  }

  employees(): Observable<any>{
    return this.httpClient.get<any>(this.api_url + "/allEmployee")
  }

  ListEmployee(): Observable<any>{
    return this.httpClient.get<any>(this.api_url + "/employees")
  }

  listEmployees(idList: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + "/listEmployee", idList ,{
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  listEmployeesRestore(idList: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + "/listEmployeeRestore", idList ,{
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  remove(deleteIds: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + "/remove", deleteIds);
  }

  restore(deleteIds: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + "/restore", deleteIds);
  }
}
