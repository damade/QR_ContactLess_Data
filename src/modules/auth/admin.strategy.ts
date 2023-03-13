import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validateLoginCredentials } from 'src/core/utils/helpers/validators.helper';
import { AdminAuthService } from './admin_user/admin.auth.service';
import { validateAdminLoginCredentials } from 'src/core/utils/helpers/admin.validators.helper';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(private readonly authService: AdminAuthService) {
        super({ usernameField: 'phoneNumberOrEmailOrStaffId', passwordField: 'password'});
    }

    async validate(phoneNumberOrEmailOrStaffId: string, password: string): Promise<any>{
        const requestBody = validateAdminLoginCredentials({phoneNumberOrEmailOrStaffId, password})
        const user = await this.authService.validateUser(requestBody.phoneNumber, password, requestBody.email, requestBody.staffId);
        
        if (!user) {
         throw new UnauthorizedException('Invalid user credentials');
        }
        return user;
    }

}