import { Component, OnInit } from '@angular/core';
import {TokenService} from "../../service/security/token.service";
import {Router} from "@angular/router";
import {User} from "../../model/user/user";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('sidebarAnimation', [
      state('open', style({
        marginLeft: '0',
      })),
      state('closed', style({
        marginLeft: '-250px',
      })),
      transition('open => closed', animate('0.3s ease-in')),
      transition('closed => open', animate('0.3s ease-out')),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  isSidebarOpen = true;
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
        else if (roles.includes('ROLE_USER')) {
          this.accountRole = 'ROLE_USER';
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

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
