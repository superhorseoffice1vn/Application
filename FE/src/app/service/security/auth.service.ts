import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginForm} from "../../model/security/login-form";
import {Observable} from "rxjs";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api_url = 'http://localhost:8080/api/auth'

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,) {
  }


  login(loginForm: LoginForm): Observable<any> {
    return this.httpClient.post<any>(this.api_url + '/login', loginForm);
  }

  createUser(user: any): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.api_url + '/signup', user, { headers });
  }

  checkUsername(username: string): Observable<any> {
    let dto = {
      username: username
    };
    return this.httpClient.post<any>(this.api_url + '/checkUniqueUsername', dto);
  }

}
