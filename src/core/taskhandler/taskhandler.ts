import {HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { AppLogger } from "../logger/logger";
import { getErrorMessage } from "../utils/helpers/error.helper";

@Injectable()
export class TaskHandlerService {

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly logger: AppLogger
    ) { }

    /**
 * Add Cron Jobs
 * @param {String} cron_name
 * @returns {object} Job
 */

     addCronJob = (name: string, job: CronJob) =>{  
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
      
        console.log(
          `job ${name} added for each minute at ${job.nextDate()} seconds!`,
        );
      }

      stopCronJob = (name: string) => {
        const job = this.schedulerRegistry.getCronJob(name);

        job.stop();
        this.logger.log(job.lastDate())
      }

      deleteCron = (name: string) => {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.log(`job ${name} deleted!`);
      }

      getCrons = () =>{
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key, map) => {
          let next;
          try {
            next = value.nextDates().toDate();
          } catch (error) {
            next = 'error: next fire date is in the past!';
            this.logger.error(getErrorMessage(error));
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
          }
          this.logger.log(`job: ${key} -> next: ${next}`);
        });
      }

      addInterval(name: string, milliseconds: number) {
        const callback = () => {
          this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
        };
      
        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
      }

      deleteInterval = (name: string) =>{
        this.schedulerRegistry.deleteInterval(name);
        this.logger.warn(`Interval ${name} deleted!`);
      }

      getIntervals = () => {
        const intervals = this.schedulerRegistry.getIntervals();
        intervals.forEach(key => this.logger.log(`Interval: ${key}`));
      }

      clearAnInterval = () => {
        const interval = this.schedulerRegistry.getInterval('notifications');
        clearInterval(interval);
      }

      getTimeouts() {
        const timeouts = this.schedulerRegistry.getTimeouts();
        timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
      }

      deleteTimeout(name: string) {
        this.schedulerRegistry.deleteTimeout(name);
        this.logger.warn(`Timeout ${name} deleted!`);
      }

      addTimeout(name: string, milliseconds: number) {
        const callback = () => {
          this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
        };
      
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);
      }
}