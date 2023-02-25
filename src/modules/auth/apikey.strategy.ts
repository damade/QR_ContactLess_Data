import Strategy, { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './user/auth.service';
import { AppLogger } from 'src/core/logger/logger';
import { nextTick } from 'process';

//@Injectable()
// export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
//   constructor(private readonly authService: AuthService,
//               private readonly appLogger: AppLogger) {
//     super({ header: 'Api-Key', prefix: '' }, true, 
//     (apikey, done) => {
//         return this.validate(apikey, done)
//     })
//   }

//   public validate = (apikey: string, done: (data: Boolean) => {}) => {
//     const checkKey = this.authService.validateApiKey(apikey);
//     this.appLogger.log(checkKey)
//       if (!checkKey) {
//         return done(false);
//       }
//       return done(true);
// }

// }


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'Api-Key') {
    constructor(
      private readonly authService: AuthService,
      private readonly appLogger: AppLogger
    ) {
        super({ header: 'Api-Key', prefix: '' },
        true,
        async (apiKey, done) => {
            return this.validate(apiKey, done);
        });
    }

    public validate = (apiKey: string, done: (error: Error, data) => {}) => {
      const checkKey = this.authService.validateApiKey(apiKey);
      this.appLogger.log("ApiKeyStrat")
      this.appLogger.log(checkKey)
        if (this.authService.validateApiKey(apiKey)) {
            done(null, true);
            return
        }
        done(new UnauthorizedException(), null);
    }
}