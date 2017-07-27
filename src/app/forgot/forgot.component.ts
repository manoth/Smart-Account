import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import swal from 'sweetalert2';

import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
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
export class ForgotComponent implements OnInit {

  isFocused: boolean = true;
  hasErrorCid: string;
  Cid: string;

  constructor(
    private mainService: MainService,
    private encryptService: EncryptService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submitForgot(form) {
    if (form.Cid) {
      this.onCid(form.Cid);
    } else {
      this.hasErrorCid = '*กรุณาป้อนเลขประจำตัวประชาชน!';
    }
  }

  onCid(cid) {
    document.getElementById('Cid').focus();
    let objData = { username: cid };
    let encData = this.encryptService.encrypt(JSON.stringify(objData));
    let path = 'signin/username';
    this.mainService.postEncript(path, encData)
      .then((data: any) => {
        if (data.ok) {
          this.sweetAlert(cid,1);
        } else {
          this.sweetAlert(cid,2);
          this.Cid = null;
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  sweetAlert(txt: string, id: number) {
    let router = this.router;
    if (id===1) {
      swal({
        title: 'ยินดีด้วยด้วย!',
        text: `เราได้ทำการส่งคำขอรีเซ็ตรหัสผ่านของคุณ 
          ไปยัง ${txt} เรียบร้อยแล้ว. 
          หากต้องการเปลี่ยนที่อยู่ Email ใหม่
          กรุณาติดต่อ 044-836826 ต่อ 206.`,
        type: 'success',
        confirmButtonText: 'ตกลง',
        allowOutsideClick: false
      }).then(function () {
        router.navigate(['/signin'], { queryParams: { 'flowEntry': 'ServiceLogin' } });
      });
    } else {
      swal({
        title: 'เสียใจด้วย!',
        text: `หมายเลขประจำตัวประชาชน ${txt}
          นี้ยังไม่เคยลงทะเบียนเข้าใช้งานระบบ 
          Smart Account นี้มาก่อน 
          คุณต้องการที่จะลงทะเบียนเข้าใช้งานใหม่หรือไม่ ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        allowOutsideClick: false
      }).then(function () {
        router.navigate(['/signup'], { queryParams: { 'flowEntry': 'ServiceRegister' } });
      }, function (close) {
        console.log(close);
      });
    }  
  }

  clearAccount() {
    localStorage.removeItem('ACCOUNT');
  }

}
