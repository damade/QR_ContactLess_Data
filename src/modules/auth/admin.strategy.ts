import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validateLoginCredentials } from 'src/core/utils/helpers/validators.helper';
import { AdminAuthService } from './admin_user/admin.auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(private readonly authService: AdminAuthService) {
        super({ usernameField: 'phoneNumberOrEmail', passwordField: 'password'});
    }

    async validate(phoneNumberOrEmail: string, password: string): Promise<any>{
        const requestBody = validateLoginCredentials({phoneNumberOrEmail, password})
        const user = await this.authService.validateUser(requestBody.phoneNumber, password, requestBody.email);
        
        if (!user) {
         throw new UnauthorizedException('Invalid user credentials');
        }
        return user;
    }

}