import * as CryptoJS from 'crypto-js';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  constructor() {}

  // Declare this key and iv values in declaration
  private key = CryptoJS.enc.Utf8.parse('4512631236589784');
  private iv = CryptoJS.enc.Utf8.parse('4512631236589784');

  encryptSecretKey = 'mySecretKeyHere';

  // Methods for the encrypt and decrypt Using AES
  encryptUsingAES256() {
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify({ password: 'Mypassword@123' })),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    console.log('Encrypted :' + encrypted);
    this.decryptUsingAES256(encrypted);
    return encrypted;
  }

  decryptUsingAES256(decString: any) {
    var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    console.log('Decrypted : ' + decrypted);
    console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
  }

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
