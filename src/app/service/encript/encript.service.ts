import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as CryptoJs from 'crypto-js';

@Injectable()
export class EncryptService {

  encKey: string = '1234567890';

  constructor(
    private http: Http
  ) {}

  encrypt(data: string) {
    let ciphertext = CryptoJs.AES.encrypt(data, this.encKey);
    return ciphertext.toString();
  }

  decrypt(enc: string) {
    let bytes = CryptoJs.AES.decrypt(enc, this.encKey);
    let plaintext = bytes.toString(CryptoJs.enc.Utf8);
    return plaintext;
  }

  // base64 encoded
  utoa(str: string) {
    return window.btoa(str).replace('=','');
  }
  // base64 decoded
  atou(str: string) {
    return window.atob(str.replace('=',''));
  }

}