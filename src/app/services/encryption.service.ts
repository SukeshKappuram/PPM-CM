import * as CryptoJS from 'crypto-js';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  constructor() {}

  // Declare this key and iv values in declaration
  private key = CryptoJS.enc.Utf8.parse('6F1330FCF715439C987163C978B48231');
  private iv = CryptoJS.enc.Utf8.parse('3836204847484948');

  encryptSecretKey = 'mySecretKeyHere';

  // Methods for the encrypt and decrypt Using AES
  encrypt(data: string) {
    const encrypted = CryptoJS.AES.encrypt(data,
      this.key,
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return encrypted.toString();
  }

  decrypt(encryptedData: any) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  //Data Encryption Function
  encryptData(msg: any) {
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    var result = CryptoJS.enc.Base64.stringify(
      salt.concat(iv).concat(encrypted.ciphertext)
    );

    return result;
  }
}
