import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminUsersService } from '../admin_users/admin.users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService,
                private readonly adminUserService: AdminUsersService) {
        super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
             ignoreExpiration: false,
             secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        const user = payload.isAdmin ?  await this.adminUserService.findOneById(payload._id)
            : await this.userService.findOneByUserId(payload._id)
        
        if (!user) {
            throw new UnauthorizedException('Invalid Token, you are not authorized to perform the operation');
        }else if(!user.bearerToken){
            throw new UnauthorizedException('You logged out and not authorized, proceed to login.');
        }
        return payload;
    }
}