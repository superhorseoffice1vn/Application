import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../security/token.service';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private API_URL = environment.API_URL;
  api_url = `${this.API_URL}/api/agent`;

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  createAgent(agent: any): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/create', agent);
  }

  listEmployee(search: any, pageNumber: number): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/listEmployee' + '?page=' + pageNumber, search);
  }

  listAdmin(search: any, pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<any>(this.api_url + '/listAdmin' + '?page=' + pageNumber, search, { headers });
  }

  agentById(id: number | undefined): Observable<any> {
    return this.httpClient.get<any>(this.api_url + '/' + id);
  }

  updateAgent(agent: any, id: string): Observable<any> {
    return this.httpClient.put<any>(this.api_url + '/update/' + id, agent);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.api_url + '/delete/' + id);
  }
  updateEmployees(id: number, idList: number[]): Observable<any> {
    const requestBody = {
      id: id,
      idList: idList,
    };
    return this.httpClient.put<any>(this.api_url + '/updateEmployeeId', requestBody);
  }

  getAll(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<any>(this.api_url + '/allAgent', { headers });
  }

  remove(deleteIds: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/remove', deleteIds);
  }

  restore(deleteIds: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/restore', deleteIds);
  }

  listAgent(idList: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/listAgent', idList, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  listAgentRestore(idList: number[]): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/listAgentRestore', idList, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  listRestore(search: any, pageNumber: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<any>(this.api_url + '/listAdminRestore' + '?page=' + pageNumber, search, { headers });
  }
}
