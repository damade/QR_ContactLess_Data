
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CipherService {

   private passPhrase = process.env.PASSPHRASE

    encryptWithAES(text: string): string {
        return CryptoJS.AES.encrypt(text, this.passPhrase).toString();
    };

    decryptWithAES(ciphertext: string): string {
        const bytes = CryptoJS.AES.decrypt(ciphertext, this.passPhrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    };

     async hashPassword(password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}  