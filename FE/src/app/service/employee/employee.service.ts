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

  employeeList(pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<any>(this.api_url + '/list'+ '?page=' + pageNumber,{ headers });
  }

  detailUser(id: number | undefined): Observable<any> {
    return this.httpClient.get<any>(this.api_url + '/detail/' + id);
  }

  changePassword(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/change-password',obj);
  }
}
