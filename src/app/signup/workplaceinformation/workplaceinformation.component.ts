import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import swal from 'sweetalert2';

import { MainService } from '../../service/main/main.service';
import { EncryptService } from '../../service/encript/encript.service';

@Component({
  selector: 'app-workplaceinformation',
  templateUrl: './workplaceinformation.component.html',
  styleUrls: ['./workplaceinformation.component.css'],
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
export class WorkplaceinformationComponent implements OnInit {

  @Input() dataFormPage: any;
  @Output() nextPage: EventEmitter<object> = new EventEmitter();

  isFocus: boolean = true;
  arrChangwat: Array<any>;
  arrAmpur: Array<any>;
  arrTambon: Array<any>;
  arrHospcode: Array<any>;
  arrWorkgroup: Array<any>;
  arrTypeprofile: Array<any>;
  arrPosition: Array<any>;
  arrLevel: Array<any>;
  arrManage: Array<any>;

  Changwat: string = '';
  Ampur: string = '';
  Tambon: string = '';
  Hospcode: string = '';
  Workgroup: string = '';
  Typeprofile: string = '';
  Position: string = '';
  Level: string = '';
  Manage: string = '00';

  requiredNull: string = '*จำเป็นต้องมีข้อมูล!';
  changwatError: string = '';
  ampurError: string = '';
  tambonError: string = '';
  hospcodeError: string = '';
  workgroupError: string = '';
  typeprofileError: string = '';
  positionError: string = '';
  levelError: string = '';
  manageError: string = '';

  constructor(
    private router: Router,
    private mainService: MainService,
    private encryptService: EncryptService
  ) {
    this.getChangwat();
    this.getTypeprofile();
    this.getPosition();
    this.getManage();
  }

  ngOnInit() {
    // console.log(this.dataFormPage);
  }

  onNextPage(form) {
    let checkChangwat = this.checkChangwat(this.Changwat);
    let checkAmpur = this.checkAmpur(this.Ampur);
    let checkTambon = this.checkTambon(this.Tambon);
    let checkHospcode = this.changeHospcode(this.Hospcode);
    let checkTypeprofile = this.changeTypeprofile(this.Typeprofile);
    let checkPosition = this.changePosition(this.Position);
    let checkWorkgroup;
    let checkLevel;
    if (this.Hospcode == '00024') {
      checkWorkgroup = this.changeWorkgroup(this.Workgroup);
    } else {
      checkWorkgroup = true;
      form.Workgroup = null;
    }
    if (this.Typeprofile == '01') {
      checkLevel = this.changeLevel(this.Level);
    } else {
      checkLevel = true;
      form.Level = '000';
      form.Manage = this.Manage;
    }

    if (checkChangwat
      && checkAmpur
      && checkTambon
      && checkHospcode
      && checkWorkgroup
      && checkTypeprofile
      && checkPosition
      && checkLevel) {
      this.dataFormPage.form3 = form;
      let data = this.dataFormPage;
      this.insetData(data);
    }
  }

  onPreviousPage() {
    this.dataFormPage.page = +this.dataFormPage.page - 1;
    let event = this.dataFormPage;
    this.nextPage.emit(event);
  }

  changeChangwat(val) {
    this.Ampur = '';
    this.Tambon = '';
    this.Hospcode = '';
    this.checkChangwat(val);
  }

  checkChangwat(val) {
    if (val != '') {
      this.getAmpur(val);
      this.changwatError = undefined;
    } else {
      this.changwatError = this.requiredNull;
    }
    return !this.changwatError;
  }

  changeAmpur(val) {
    this.Tambon = '';
    this.Hospcode = '';
    this.checkAmpur(val);
  }

  checkAmpur(val) {
    if (val != '') {
      this.getTambon(val);
      this.ampurError = undefined;
    } else {
      this.ampurError = this.requiredNull;
    }
    return !this.ampurError;
  }

  changeTambon(val) {
    this.Hospcode = '';
    this.checkTambon(val);
  }

  checkTambon(val) {
    if (val != '') {
      this.getHospcode(val);
      this.tambonError = undefined;
    } else {
      this.tambonError = this.requiredNull;
    }
    return !this.tambonError;
  }

  changeHospcode(val) {
    if (val == '00024') {
      this.getWorkgroup();
    } else {
      this.Workgroup = '';
    }
    if (val != '') {
      this.hospcodeError = undefined;
    } else {
      this.hospcodeError = this.requiredNull;
    }
    return !this.hospcodeError;
  }

  changeWorkgroup(val) {
    if (val != '') {
      this.workgroupError = undefined;
    } else {
      this.workgroupError = this.requiredNull;
    }
    return !this.workgroupError;
  }

  changeTypeprofile(val) {
    if (val == '01') {
      this.getLevel();
    } else {
      this.Level = '';
      this.Manage = '00';
    }
    if (val != '') {
      this.typeprofileError = undefined;
    } else {
      this.typeprofileError = this.requiredNull;
    }
    return !this.typeprofileError;
  }

  changePosition(val) {
    if (val != '') {
      this.positionError = undefined;
    } else {
      this.positionError = this.requiredNull;
    }
    return !this.positionError;
  }

  changeLevel(val) {
    if (val != '') {
      this.levelError = undefined;
    } else {
      this.levelError = this.requiredNull;
    }
    return !this.levelError;
  }

  getChangwat() {
    let path = 'signup/prov';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrChangwat = data.rows;
        }
      });
  }

  getAmpur(changwat) {
    let path = 'signup/prov/' + changwat;
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrAmpur = data.rows;
        }
      });
  }

  getTambon(ampur) {
    let path = 'signup/prov/' + this.Changwat + '/' + ampur;
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrTambon = data.rows;
        }
      });
  }

  getHospcode(tambon) {
    let path = 'signup/prov/' + this.Changwat + '/' + this.Ampur + '/' + tambon;
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrHospcode = data.rows;
        }
      });
  }

  getWorkgroup() {
    let path = 'signup/workgroup';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrWorkgroup = data.rows;
        }
      });
  }

  getTypeprofile() {
    let path = 'signup/typeprofile';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrTypeprofile = data.rows;
        }
      });
  }

  getPosition() {
    let path = 'signup/position';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrPosition = data.rows;
        }
      });
  }

  getLevel() {
    let path = 'signup/level';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrLevel = data.rows;
        }
      });
  }

  getManage() {
    let path = 'signup/manage';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrManage = data.rows;
        }
      });
  }

  insetData(data) {
    let path = 'signup';
    let encData = this.encryptService.encrypt(JSON.stringify(data));
    this.mainService.postEncript(path, encData)
      .then((res: any) => {
        // console.log(res);
        if (res.ok) {
          let router = this.router;
          swal({
            title: 'ยินดีด้วย!',
            text: 'คุณสร้างบัญชี Smart Account สำเร็จแล้ว',
            type: 'success',
            allowOutsideClick: false
          }).then(function () {
            localStorage.removeItem('ACCOUNT');
            router.navigate(['/signin'], { queryParams: { 'flowEntry': 'ServiceLogin' } });
          });
        }  
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

}
