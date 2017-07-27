import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Module 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FocusModule } from 'angular2-focus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdNativeDateModule } from '@angular/material';

// Http Service
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

// Rounting
import { RouterModule } from '@angular/router';

// Service
import { MainService } from './service/main/main.service';
import { EncryptService } from './service/encript/encript.service';
import { OtherService } from './service/other/other.service';

import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LogininformationComponent } from './signup/logininformation/logininformation.component';
import { PersonalinformationComponent } from './signup/personalinformation/personalinformation.component';
import { WorkplaceinformationComponent } from './signup/workplaceinformation/workplaceinformation.component';
import { ForgotComponent } from './forgot/forgot.component';

import { FormatCidDirective } from './directive/format-cid.directive';
import { FormatTelDirective } from './directive/format-tel.directive';


export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => localStorage.getItem('token')),
  }), http);
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    LogininformationComponent,
    PersonalinformationComponent,
    WorkplaceinformationComponent,
    FormatCidDirective,
    FormatTelDirective,
    ForgotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'signin', pathMatch: 'full' }, 
      { path: 'signin', component: SigninComponent, data: { pageHeader: 'ลงชื่อเข้าใช้ด้วยบัญชีของคุณ' } },
      { path: 'signup', component: SignupComponent, data: { pageHeader: 'สร้างบัญชีเพื่อเข้าใช้งานระบบ' } },
      { path: 'forgot', component: ForgotComponent, data: { pageHeader: 'ลืมรหัสผ่านในการเข้าใช้งาน' } },
      { path: '**', redirectTo: 'signin', pathMatch: 'full' }   
    ], { useHash: false }),
    FocusModule.forRoot()
  ],
  providers: [
    Title,
    { provide: 'API_URL', useValue: 'http://127.0.0.1:3000' },
    { provide: 'MAIN_URL', useValue: 'http://cpho.moph.go.th' },
    { provide: AuthHttp, useFactory: getAuthHttp, deps: [Http] },
    MainService,
    EncryptService,
    OtherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
