import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { validateLoginCredentials } from 'src/core/utils/helpers/validators.helper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'phoneNumber', passwordField: 'password', emailField: 'email' });
    }

    async validate(phoneNumber: string, password: string, email): Promise<any>{
        validateLoginCredentials({phoneNumber, password, email})
        const user = await this.authService.validateUser(phoneNumber, password, email);
        
        if (!user) {
         throw new UnauthorizedException('Invalid user credentials');
        }
        return user;
    }


}