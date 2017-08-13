import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location, DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';

import { CookieService } from 'ngx-cookie-service';
import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  buttonLogout: boolean = true;
  loadingPage: boolean;
  profile: any[];
  isFocused: boolean = true;

  requiredNull: string = '*จำเป็นต้องมีข้อมูล!';
  editPassword: boolean;
  oldPassError: string;
  newPass1Error: string;
  newPass2Error: string;
  Oldpassword: string;
  Newpassword: string;
  reNewpassword: string;
  
  editUser: boolean;
  userError: string;
  Username: string;
  
  editName: boolean;
  nameError: string;
  Name: string;

  editTel: boolean;
  telError: string;
  Tel: string;

  editEmail: boolean;
  emailError: string;
  Email: string;
  fullName: string;

  datePipeEn: DatePipe = new DatePipe('en-US');
  datePipeTh: DatePipe = new DatePipe('th-TH');
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService
  ) {
    if (!this.otherService.checkToken()) {
      this.logout();
    } else {
      let token = localStorage.getItem('token');
    }
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    let path = 'profile';
    this.mainService.getAuthHttp(path)
      .then((res: any) => {
        if (res.ok) {
          let decData = this.encryptService.decrypt(res.rows);
          let rows = JSON.parse(decData);
          this.loadingPage = true;
          this.profile = rows[0];
          this.Username = rows[0].USERNAME;
          this.Name = rows[0].NAME;
          this.Tel = rows[0].TELEPHONE_NUMBER;
          this.Email = rows[0].EMAIL;
          this.fullName = rows[0].PRENAME + rows[0].FIRSTNAME + ' ' + rows[0].LASTNAME;
          let pageHeader = this.route.snapshot.data['pageHeader'] + '-' + this.fullName;
          this.title.setTitle(pageHeader);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  
  submitNewPass(form) {
    let Oldpassword = this.checkOldpass(form.Oldpassword);
    let Password = this.checkPass1(form);
    let PasswordAgain = this.checkPass2(form);
    if (Oldpassword && Password && PasswordAgain) {
      let path = 'profile/newpassword';
      let data = {
        oldpass: form.Oldpassword,
        newpass: form.Newpassword
      };
      let encData = this.encryptService.encrypt(JSON.stringify(data));
      let resetBlockPass = this.resetBlockPass();
      this.mainService.postAuthHttp(path, encData)
        .then((res: any) => {
          if (res.ok) {
            swal({
            title: 'ยินดีด้วย!',
            text: 'คุณเปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว.',
            type: 'success',
            allowOutsideClick: false
          }).then(function () {
            resetBlockPass;
          });
          } else {
            console.log(res);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  checkOldpass(oldpass) {
    if (oldpass) {
      let path = 'profile/checkOldpass';
      let data = { oldpass: oldpass };
      let encData = this.encryptService.encrypt(JSON.stringify(data));
      this.mainService.postAuthHttp(path, encData)
        .then((res: any) => {
          if (!res.ok) {
            this.oldPassError = res.txt;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.oldPassError = this.requiredNull;
    }
    return !this.oldPassError;
  }

  checkPass1(form) {
    if (form.Newpassword) {
      if (form.Newpassword == this.profile['CID']) {
        this.newPass1Error = '*รหัสผ่านควรจะแตกต่างจาก บัญชีผู้ใช้ หรือ เลขประจำตัวประชาชน ที่คุณใช้อยู่';
      }
      if (form.Newpassword.match(/([^a-zA-Z0-9!%&@#$^*?_~])/)) {
        this.newPass1Error = '*รหัสผ่านป้อนได้เฉพาะ a-z,A-Z,0-9 และเครื่องหมายวรรคตอนทั่วไปเท่านั้น กรุณาตรวจสอบภาษาของแป้นพิมพ์';
      }
      if (form.Newpassword.length < 8) {
        this.newPass1Error = '*รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
      }
    } else {
      this.newPass1Error = this.requiredNull;
    }
    return !this.newPass1Error;
  }

  checkPass2(form) {
    if (form.reNewpassword) {
      if (form.reNewpassword != form.Newpassword) {
        this.newPass2Error = '*ยืนยันรหัสผ่านไม่ตรงกัน ลองใหม่อีกครั้ง';
      }
    } else {
      this.newPass2Error = this.requiredNull;
    }
    return !this.newPass2Error;
  }

  changePass(form) {
    this.reNewpassword = '';
    this.newPass2Error = undefined;
  }

  resetBlockPass() {
    this.editPassword = !this.editPassword;
    this.Oldpassword = '';
    this.Newpassword = '';
    this.reNewpassword = '';
    this.oldPassError = undefined;
    this.newPass1Error = undefined;
    this.newPass2Error = undefined;
  }

  updateProfile() {
    let path = 'profile/updateprofile';
    let data = this.profile;
    let encData = this.encryptService.encrypt(JSON.stringify(data));
    this.mainService.postAuthHttp(path, encData)
      .then((res: any) => {
        if (res.ok) {
          swal({
          title: 'ยินดีด้วย!',
          text: 'คุณเปลี่ยน Update ข้อมูลส่วนตัวสำเร็จแล้ว.',
          type: 'success',
          allowOutsideClick: false
          });
        } else {
          console.log(res);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  
  clickEditUser() {
    this.Username = this.profile['USERNAME'];
    this.userError = undefined;
    this.editUser = false;
  }
  
  clickEditName() {
    this.Name = this.profile['NAME'];
    this.nameError = undefined;
    this.editName = false;
  }

  clickEditTel() {
    this.Tel = this.profile['TELEPHONE_NUMBER'];
    this.telError = undefined;
    this.editTel = false;
  }

  clickEditEmail() {
    this.Email = this.profile['EMAIL'];
    this.emailError = undefined;
    this.editEmail = false;
  }

  submitUser(form) {
    let Username = this.checkUser(form.Username);
    if (Username && form.Username) {
      this.profile['USERNAME'] = form.Username;
      this.updateProfile();
      this.editUser = false;
    }
  }

  submitName(form) {
    let Name = this.checkName(form.Name);
    if (Name && form.Name) {
      this.profile['NAME'] = form.Name;
      this.updateProfile();
      this.editName = false;
    }
  }

  submitTel(form) {
    let Tel = this.checkTel(form.Tel);
    if (Tel && form.Tel) {
      this.profile['TELEPHONE_NUMBER'] = form.Tel.replace(/\D/g, '');
      this.updateProfile();
      this.editTel = false;
    }
  }

  submitEmail(form) {
    let Email = this.checkEmail(form.Email);
    if (Email && form.Email) {
      this.profile['EMAIL'] = form.Email;
      this.updateProfile();
      this.editEmail = false;
    }
  }

  checkUser(val) {
    if (val) {
      if (val!=this.profile['USERNAME']) {
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
        this.userError = undefined;
      }
    } else {
      this.userError = this.requiredNull;
    }
    return !this.userError;
  }

  checkName(name) {
    if (!name) {
      this.nameError = this.requiredNull;
    }
    return !this.nameError;
  }

  checkTel(val) {
    if (val) {
      let phone = val.replace(/\D/g, '');
      if (phone.length < 10 || ['06', '08', '09'].indexOf(phone.substring(0, 2)) == -1) {
        this.telError = 'หมายเลขโทรศัพท์มือถือของคุณไม่ถูกต้อง';
      }
    } else {
      this.telError = this.requiredNull;
    }
    return !this.telError;
  }

  checkEmail(val) {
    if (val) {
      let emailFormat = /^([a-zA-Z0-9\_\.\-]+)@([a-zA-Z0-9]+)\.([a-zA-Z0-9\.]{2,5})$/;
      if (!emailFormat.test(val)) {
        this.emailError = 'รูปแบบอักขระ Email ไม่ถูกต้อง!';
      }
    } else {
      this.emailError = this.requiredNull;
    }
    return !this.emailError;
  }

  logout() {
    this.otherService.logout();
    this.buttonLogout = false;
    this.router.navigate(['/signin'], { queryParams: { flowEntry: 'ServiceLogin' } });
  }

}
