import { Component, OnInit } from '@angular/core';
import {TokenService} from "../../service/security/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  checkLogin = false;
  nameAccount: any;
  // @ts-ignore
  currentUser: User;
  // @ts-ignore
  accountRole: string;

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.tokenService.isLogged()) {
      this.checkLogin = true;
      this.currentUser = JSON.parse(this.tokenService.getUser());
      this.nameAccount = this.currentUser.name;

      const roles = this.tokenService.getRole();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ROLE_ADMIN') {
          this.accountRole = 'ROLE_ADMIN';
        }
      }
    }

  }

  logOut(): void {
    this.tokenService.logOut();
    this.router.navigateByUrl('').then(() => {
      location.reload();
    });
  }

}
