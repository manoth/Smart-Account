import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import swal from 'sweetalert2';

import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(300, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(60px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-60px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class NewpasswordComponent implements OnInit {

  arrSysten: any[];
  isFocused: boolean = true;
  requiredNull: string = '*จำเป็นต้องมีข้อมูล!';
  pass1Error: string;
  pass2Error: string;
  Cid: string;
  Username: string;
  Password: string;
  PasswordAgain: string;

  token: string;

  constructor(
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let token = this.route.snapshot.queryParams['token'];
    if (token) {
      sessionStorage.setItem('token', token);
    }
    this.token = sessionStorage.getItem('token');
    this.otherService.addSession();
    this.otherService.checkClientId()
      .then((data: any) => {
        let system = data.data;
        this.arrSysten = JSON.parse(this.encryptService.decrypt(system));
        this.onCheckToken(this.token);
      })
      .catch((error: any) => {
        console.log(error);
      });
    let params = sessionStorage.getItem('followup');
    let objParams = { flowEntry: 'ServiceNewpass' };
    this.router.navigate(['/newpassword'], { queryParams: objParams });
  }

  submitNewPass(form) {
    form.Cid = this.Cid;
    let Password = this.checkPass1(form);
    let PasswordAgain = this.checkPass2(form);
    if (Password && PasswordAgain) {
      console.log(form);
    }
  }

  checkPass1(form) {
    if (form.Password) {
      if (form.Password == this.Username || form.Password == this.Cid) {
        this.pass1Error = 'รหัสผ่านควรจะแตกต่างจาก บัญชีผู้ใช้ หรือ เลขประจำตัวประชาชน ที่คุณใช้อยู่';
      }
      if (form.Password.match(/([^a-zA-Z0-9!%&@#$^*?_~])/)) {
        this.pass1Error = 'รหัสผ่านป้อนได้เฉพาะ a-z,A-Z,0-9 และเครื่องหมายวรรคตอนทั่วไปเท่านั้น กรุณาตรวจสอบภาษาของแป้นพิมพ์';
      }
      if (form.Password.length < 8) {
        this.pass1Error = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
      }
    } else {
      this.pass1Error = this.requiredNull;
    }
    return !this.pass1Error;
  }

  checkPass2(form) {
    if (form.PasswordAgain) {
      if (form.PasswordAgain != form.Password) {
        this.pass2Error = 'ยืนยันรหัสผ่านไม่ตรงกัน ลองใหม่อีกครั้ง';
      }
    } else {
      this.pass2Error = this.requiredNull;
    }
    return !this.pass2Error;
  }

  changePass(form) {
    this.PasswordAgain = '';
    this.pass2Error = undefined;
  }

  clearAccount() {
    localStorage.removeItem('ACCOUNT');
  }

  onCheckToken(token: string) {
    let path = 'forgot';
    let objData = { token: token };
    let encData = this.encryptService.encrypt(JSON.stringify(objData));
    this.mainService.postEncript(path, encData)
      .then((res: any) => {
        if (!res.ok) {
          this.sweetAlert(res.data);
        } else {
          this.Cid = res.rows.CID;
          this.Username = res.rows.USERNAME;
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  sweetAlert(txt) {
    let router = this.router;
    swal({
      title: 'เสียใจด้วย!',
      text: `${txt}`,
      type: 'error',
      confirmButtonText: 'ตกลง',
      allowOutsideClick: false
    }).then(function () {
      router.navigate(['/forgot'], { queryParams: { 'flowEntry': 'ServiceForgot' } });
    });
  }

}
