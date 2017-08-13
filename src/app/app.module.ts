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
import { CookieService } from 'ngx-cookie-service';
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
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { LogoComponent } from './share/logo/logo.component';
import { FooterComponent } from './share/footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';


export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => localStorage.getItem('token'))
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
    ForgotComponent,
    NewpasswordComponent,
    LogoComponent,
    FooterComponent,
    ProfileComponent,
    LogoutComponent
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
      { path: 'newpassword', component: NewpasswordComponent, data: { pageHeader: 'ตั้งรหัสผ่านใหม่' } },
      { path: 'profile', component: ProfileComponent, data: { pageHeader: 'ข้อมูลส่วนตัว' } },
      { path: 'logout', component: LogoutComponent, data: { pageHeader: 'กำลังออกจากระบบ' } },
      { path: '**', redirectTo: 'signin', pathMatch: 'full' }
    ], { useHash: false }),
    FocusModule.forRoot()
  ],
  providers: [
    Title,
    CookieService,
    { provide: 'API_URL', useValue: 'http://203.157.182.15:3000' },
    { provide: 'MAIN_URL', useValue: 'http://cpho.moph.go.th' },
    { provide: AuthHttp, useFactory: getAuthHttp, deps: [Http] },
    MainService,
    EncryptService,
    OtherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
