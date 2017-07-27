import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { MainService } from '../../service/main/main.service';

declare var $: any;

@Component({
  selector: 'app-personalinformation',
  templateUrl: './personalinformation.component.html',
  styleUrls: ['./personalinformation.component.css'],
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
export class PersonalinformationComponent implements OnInit, AfterViewInit {

  ngAfterViewInit() {
    $('#date-picker').datepicker({
      autoclose: true,
      todayHighlight: true,
      startView: 'decade',
      minView: 'decade',
      viewSelect: 'decade',
      format: 'dd-mm-yyyy',
      language: 'th-th',
      endDate: new Date()
    });
  }

  @Input() dataFormPage: any;
  @Output() nextPage: EventEmitter<object> = new EventEmitter();

  isFocus: boolean = true;
  pnameError: string;
  fnameError: string;
  lnameError: string;
  birthError: string;
  sexError: string;
  telError: string;
  emailError: string;
  arrPrename: Array<any>;
  requiredNull: string = '*จำเป็นต้องมีข้อมูล!';
  Prename: string = '';
  FristName: string;
  LastName: string;
  BirthDay: string;
  Sex: string;
  Tel: string;
  Email: string;

  constructor(
    private mainService: MainService
  ) {
    this.getPrename();
  }

  ngOnInit() {
    if (this.dataFormPage.form2) {
      this.Prename = this.dataFormPage.form2.Prename;
      this.FristName = this.dataFormPage.form2.FristName;
      this.LastName = this.dataFormPage.form2.LastName;
      this.BirthDay = this.dataFormPage.form2.BirthDay;
      this.Sex = this.dataFormPage.form2.Sex;
      this.Tel = this.dataFormPage.form2.Tel;
      this.Email = this.dataFormPage.form2.Email;
    }
  }

  onNextPage(form, birth) {
    let checkPname = this.checkPname(form.Prename);
    let checkFname = this.checkFname(form.FristName);
    let checkLname = this.checkLname(form.LastName);
    let checkBirth = this.checkBirth(birth);
    let checkSex = this.checkSex(form.Sex);
    let checkTel = this.checkTel(form.Tel);
    let checkEmail = this.checkEmail(form.Email);
    if (checkPname && checkFname && checkLname && checkBirth && checkSex && checkTel && checkEmail) {
      form.BirthDay = birth;
      this.dataFormPage.page = +this.dataFormPage.page + 1;
      this.dataFormPage.form2 = form;
      let event = this.dataFormPage;
      // console.log(event);
      this.nextPage.emit(event);
    }
  }

  onPreviousPage() {
    this.dataFormPage.page = +this.dataFormPage.page - 1;
    let event = this.dataFormPage;
    this.nextPage.emit(event);
  }

  checkPname(val) {
    if (!val) {
      this.pnameError = this.requiredNull;
    }
    return !this.pnameError;
  }

  checkFname(val) {
    if (!val) {
      this.fnameError = this.requiredNull;
    }
    return !this.fnameError;
  }

  checkLname(val) {
    if (!val) {
      this.lnameError = this.requiredNull;
    }
    return !this.lnameError;
  }

  checkBirth(val) {
    if (!val) {
      this.birthError = this.requiredNull;
    }
    return !this.birthError;
  }

  checkSex(val) {
    if (val == 1 || val == 2) {
      this.sexError = undefined;
    } else {
      this.sexError = this.requiredNull;
    }
    return !this.sexError;
  }

  checkTel(val) {
    if (val) {
      let phone = val.replace(/\D/g, '');
      if (phone.length > 1 && ['06', '08', '09'].indexOf(phone.substring(0, 2)) == -1) {
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

  getPrename() {
    let path = 'signup/prename';
    this.mainService.getEncript(path)
      .then((data: any) => {
        if (data.ok) {
          this.arrPrename = data.rows;
        }
      });
  }

}
