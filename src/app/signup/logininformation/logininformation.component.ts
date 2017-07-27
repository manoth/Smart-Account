import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { MainService } from '../../service/main/main.service';

@Component({
  selector: 'app-logininformation',
  templateUrl: './logininformation.component.html',
  styleUrls: ['./logininformation.component.css'],
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
export class LogininformationComponent implements OnInit {

  @Input() dataFormPage: any;
  @Output() nextPage: EventEmitter<object> = new EventEmitter();
  isFocus: boolean = true;
  cidError: string;
  userError: string;
  pass1Error: string;
  pass2Error: string;
  requiredNull: string = '*จำเป็นต้องมีข้อมูล!';
  Cid: string;
  Username: string;
  Password: string;
  PasswordAgain: string;

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit() {
    if (this.dataFormPage) {
      this.Cid = this.dataFormPage.form1.Cid;
      this.Username = this.dataFormPage.form1.Username;
      this.Password = this.dataFormPage.form1.Password;
      this.PasswordAgain = this.dataFormPage.form1.PasswordAgain;
    }
  }

  onNextPage(form) {
    let checkCid = this.checkCid(form.Cid);
    let checkUser = this.checkUser(form.Username);
    let checkPass1 = this.checkPass1(form);
    let checkPass2 = this.checkPass2(form);
    if (checkCid && checkUser && checkPass1 && checkPass2) {
      let form2 = false;
      let form3 = false;
      if (this.dataFormPage) {
        form2 = this.dataFormPage.form2;
        form3 = this.dataFormPage.form3;
      }
      let event = { page: 2, form1: form, form2: form2, form3: form3 };
      this.nextPage.emit(event);
    }
  }

  checkCid(val) {
    if (val) {
      let cid = val.replace(/\D/g, '');
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseFloat(cid.charAt(i)) * (13 - i);
      }
      if ((11 - sum % 11) % 10 == parseFloat(cid.charAt(12))) {
        let path = 'signup/checkCid';
        this.mainService.postEncript(path, cid)
          .then((res: any) => {
            if (!res.ok) {
              this.cidError = res.txt;
            } else {
              this.dataFormPage = { 'form2': res.data };
            }
          });
      } else {
        this.cidError = 'เลขประจำตัวประชาชนไม่ถูกต้อง!';
      }
    } else {
      this.cidError = this.requiredNull;
    }
    return !this.cidError;
  }

  checkUser(val) {
    if (val) {
      if (val.match(/([^a-zA-Z0-9])/)) {
        this.userError = 'ป้อนได้เฉพาะ a-z,A-Z และ 0-9 เท่านั้น';
      } else {
        let path = 'signup/checkUsername/' + val;
        this.mainService.getEncript(path)
          .then((res: any) => {
            this.userError = res.txt;
          });
      }
    } else {
      this.userError = this.requiredNull;
    }
    return !this.userError;
  }

  checkPass1(form) {
    if (form.Password) {
      if (form.Cid) {
        if (form.Password == form.Username || form.Password == form.Cid.replace(/\D/g, '')) {
          this.pass1Error = 'รหัสผ่านควรจะแตกต่างจาก บัญชีผู้ใช้ หรือ เลขประจำตัวประชาชน';
        }
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

}
