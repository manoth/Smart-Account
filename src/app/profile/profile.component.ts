import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';

import { CookieService } from 'ngx-cookie-service';
import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  buttonLogout: boolean = true;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService
  ) { 
    if (!this.otherService.checkToken()) {
      this.router.navigate(['/signin'], { queryParams: { flowEntry: 'ServiceLogin' } });
    }
    try {
      let token = localStorage.getItem('token');
      console.log(this.jwtHelper.isTokenExpired(token));
      console.log(this.jwtHelper.decodeToken(token));
    } catch (error) {
      this.logout();
    }
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    this.buttonLogout = false;
    this.router.navigate(['/signin'], { queryParams: { flowEntry: 'ServiceLogin' } });
  }

}
