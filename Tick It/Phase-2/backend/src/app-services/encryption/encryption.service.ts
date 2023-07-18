import { Service } from '@tsed/di';
import * as crypto from "crypto";
var CryptoJS = require("crypto-js");

@Service()
export class EncryptionService {
    public md5Encrypt = (value: any) => {
        return crypto.createHash("md5").update(value).digest("hex")
    }

    public aesEncrypt = (decryptedValue: any, salt: string) => {
        var md5Encryption = this.md5Encrypt(salt)
        var key = CryptoJS.enc.Base64.parse(md5Encryption);
        var iv = CryptoJS.enc.Base64.parse(md5Encryption + salt);
        var encrypted = CryptoJS.AES.encrypt(decryptedValue, key, { iv: iv });
        return encrypted.toString();
    }

    public aesDecrypt = (encryptedValue: any, salt: string) => {
        var md5Encryption = this.md5Encrypt(salt)
        var key = CryptoJS.enc.Base64.parse(md5Encryption);
        var iv = CryptoJS.enc.Base64.parse(md5Encryption + salt);
        var decrypted = CryptoJS.AES.decrypt(encryptedValue, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}