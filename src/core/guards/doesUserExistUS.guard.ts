import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BankAccountService } from 'src/modules/bankaccount/bank.account.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class DoesUserExistForAccount implements CanActivate {
    constructor(private readonly userService: UsersService,
        private readonly bankAccountService: BankAccountService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService.findOneByPhoneNumberOrEmail(request.body.phoneNumber,
                                        request.body.email);
        const bankProfile = this.bankAccountService.findOneByBvn(request.body.bvn)                                
        if (userExist && userExist.isCreatingBvn && userExist.isCreatingAccount) {
            throw new ForbiddenException('This user already has an account, you can not create an account anymore');
        } else if (userExist && userExist.isCreatingAccount) {
            throw new ForbiddenException('This user already has an account, you can not create an account anymore');
        }else if(bankProfile){
            throw new ForbiddenException('This bvn exist, you can check with your bank');
        }else if (userExist && userExist.isCreatingBvn){
            return true;
        }else if(userExist){
            throw new ForbiddenException('This phone number or email exist, kindly login and check the status');
       
        }
        return true;
    }
}