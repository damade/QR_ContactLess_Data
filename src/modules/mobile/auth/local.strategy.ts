import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { validateLoginCredentials } from 'src/core/utils/helpers/validators.helper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'phoneNumber', passwordField: 'pin' });
    }

    async validate(username: string, password: string): Promise<any>{
        validateLoginCredentials({username,password})
        const user = await this.authService.validateUser(username, password);
        
        if (!user) {
         throw new UnauthorizedException('Invalid user credentials');
        }
        return user;
    }


}