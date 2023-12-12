import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  api_url = 'http://localhost:8080/api/agent'

  constructor(private httpClient: HttpClient) { }

  createAgent(agent: any): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/create', agent);
  }

  listEmployee(search: any, pageNumber: number): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/listEmployee' + '?page=' + pageNumber, search);
  }
}
