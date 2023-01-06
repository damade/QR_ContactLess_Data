import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/mobile/users/users.service';
import { CipherService } from '../utils/service/cipher.service';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService,
                private readonly cipherService: CipherService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService
                                    .findOneByPhoneNumberOrEmailOrBVn(request.body.phoneNumber,
                                        request.body.email, request.body.bvn);
        if (userExist) {
            throw new ForbiddenException('This phone number or email or bvn exist');
        }
        return true;
    }
}