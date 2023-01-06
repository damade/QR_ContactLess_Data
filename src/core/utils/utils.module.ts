import { Module } from '@nestjs/common';
import { ApiKeyGenerationService } from './service/api.key.gen.service';
import { CipherSearchService } from './service/cipher.search.service';
import { CipherService } from './service/cipher.service';
import { EmailService } from './service/email.service';
import { MediaService } from './service/media.service';
import { OtpService } from './service/otp.service';
import { ReferralCodeService } from './service/referral.code.service';
import { SmsService } from './service/sms.service';
import { TaskHandlerService } from '../taskhandler/taskhandler';
import { LoggerModule } from '../logger/logger.module';
import { TaskHandlerModule } from '../taskhandler/task.handler.module';
import { CreditScoreService } from './service/credit.score.service';

@Module({
    imports: [LoggerModule, TaskHandlerModule],
    providers: [EmailService, CipherService, OtpService, SmsService,
         ApiKeyGenerationService, CreditScoreService,
        ReferralCodeService, MediaService, CipherSearchService, TaskHandlerService],
    exports: [EmailService, CipherService, OtpService, TaskHandlerService,
        ReferralCodeService, MediaService, CipherSearchService, ApiKeyGenerationService,
        CreditScoreService]
})
export class UtilsModule {}
