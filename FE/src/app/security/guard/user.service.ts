import {Injectable} from '@angular/core';
import {TokenService} from '../../service/security/token.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
// import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  // @ts-ignore
  canActivate(
    next: ActivatedRouteSnapshot,
    // @ts-ignore
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.tokenService.getToken()) {
      return true;
    } else {
      this.toastr.error('Yêu cầu đăng nhập');
      this.router.navigateByUrl('');
    }

  }
}
