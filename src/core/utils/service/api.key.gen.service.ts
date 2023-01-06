import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { getErrorMessage } from "../helpers/error.helper";
import { generateRandomString } from "../helpers/string.helper";
import ApiKeys, { IApiKeys, Platform } from "src/core/model/api.keys.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CronJob } from "cron";
import { TaskHandlerService } from "../../taskhandler/taskhandler";
import { APIKEY_CRON_JOB } from "src/core/constants";
import { AppLogger } from "src/core/logger/logger";

@Injectable()
export class ApiKeyGenerationService {

    constructor(
        private readonly appLogger: AppLogger,
        private readonly taskHandlerService: TaskHandlerService
    ) { }

    /**
 * Send OTP
 * @param {String} recipient
 * @returns {object}
 */


   private handleApiKeyCron = async () => {
        const job = new CronJob(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, () => {
            this.saveApiKey(Platform.Mobile);
            this.saveApiKey(Platform.Web);
          }, 'Africa/Lagos');

          this.taskHandlerService.addCronJob(APIKEY_CRON_JOB,job)
          
    };

    startApiKeyCron =  this.handleApiKeyCron.bind(this)

    private saveApiKey = async (platformType: Platform) => {
        const apikeyDoc: IApiKeys = new ApiKeys({
            api_key: this.randomApiKey(),
            platform: platformType  
        });
        apikeyDoc.save();
        return apikeyDoc;
    };


    getApiKey = async (platform): Promise<IApiKeys> => {
        return await ApiKeys.findOne({ platform }).then((apiKey: IApiKeys) => {
            if (!apiKey) {
                return null
            }
            return apiKey
        })
            .catch(error => {
                // console.error(error.message);
                console.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

   private randomApiKey = () => generateRandomString(15)
}