import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class DoesUserExistForBvn implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService.findOneByPhoneNumberOrEmail(request.body.phoneNumber,
                                        request.body.email);
        if (userExist && userExist.isCreatingBvn) {
            throw new ForbiddenException('This phone number or email exist for registering BVN, kindly login and apply');
        } else if (userExist && userExist.isCreatingAccount) {
            throw new ForbiddenException('This user already has an account, you can not apply for BVN anymore');
        } else if(userExist){
            throw new ForbiddenException('This phone number or email exist, kindly login and check the status');
       
        }
        return true;
    }
}