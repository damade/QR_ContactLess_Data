import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { validateLoginCredentials } from 'src/core/utils/helpers/validators.helper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
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