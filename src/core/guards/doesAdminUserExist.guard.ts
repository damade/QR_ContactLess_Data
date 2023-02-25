import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminUsersService } from 'src/modules/admin_users/admin.users.service';

@Injectable()
export class DoesAdminUserExist implements CanActivate {
    constructor(private readonly userService: AdminUsersService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService.findOneByPhoneNumberOrEmail(request.body.phoneNumber,
            request.body.email);
        if (userExist) {
            throw new ForbiddenException('This user already has an account, kindly login with your existing credentials');
        }
        return true;
    }
}