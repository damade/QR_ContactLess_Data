import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
  } from '@nestjs/common';
  import * as passport from 'passport';
import { AppLogger } from '../logger/logger';
  
  @Injectable()
  export class ApiKeyMiddleware implements NestMiddleware {

    constructor(private readonly appLogger: AppLogger) {
     
  }

    use(req: any, res: any, next: () => void) {
      passport.authenticate(
        'Api-Key',
        { session: false, failureRedirect: '/api/v1/customer/auth/login' },
        value => {
          this.appLogger.log(value);
          if (value) {
            next();
          } else {
            throw new UnauthorizedException();
          }
        },
      )(req, res, next);
    }
  }