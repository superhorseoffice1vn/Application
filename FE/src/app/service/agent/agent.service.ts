import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TokenService} from "../security/token.service";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  api_url = 'http://localhost:8080/api/agent'

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) { }

  createAgent(agent: any): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/create', agent);
  }

  listEmployee(search: any, pageNumber: number): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/listEmployee' + '?page=' + pageNumber, search);
  }

  listAdmin(search: any, pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.api_url + '/listAdmin' + '?page=' + pageNumber, search,{ headers });
  }

  agentById(id: number | undefined): Observable<any> {
    return this.httpClient.get<any>(this.api_url + "/" + id);
  }

  updateAgent(agent: any, id: string): Observable<any> {
    return this.httpClient.put<any>(this.api_url + '/update/' + id, agent);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.api_url + '/delete/' + id);
  }
}
