import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  arrSysten: any[];
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private encryptService: EncryptService,
    private otherService: OtherService
  ) {
    let pageHeader = this.route.snapshot.data['pageHeader'];
    this.title.setTitle(pageHeader);
    this.otherService.logout();
   }

  ngOnInit() {
    this.otherService.addSession();
    this.otherService.checkClientId()
      .then((data: any) => {
        let system = data.data;
        this.arrSysten = JSON.parse(this.encryptService.decrypt(system));
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

}
