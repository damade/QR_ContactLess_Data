import { Injectable, LoggerService, LogLevel } from "@nestjs/common";
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import { deepCopy, hasValues } from "../utils/helpers/copy.helper";


@Injectable()
export class AppLogger implements LoggerService {

    private logger: winston.Logger;

    constructor() {
        this.initializeLogger();
    }

   private initializeLogger() {

        // Tell winston that you want to link the colors 
        // defined above to the severity levels.
        winston.addColors(this.colors)

        // Create the logger instance that has to be exported 
        // and used to log messages.
        this.logger = winston.createLogger({
            level: this.level(),
            levels: this.levels,
            format: this.defaultFormat,
            transports: this.transports,
        })
    }

    log(message: any, ...optionalParams: any[]) {
        const newMessage = deepCopy<any>(message)
        this.logger.log('info', newMessage);
    }

    http(message: any) {
        const newMessage = deepCopy<any>(message)
        this.logger.http(newMessage);
    }

    error(message: any, ...optionalParams: any[]) {
        const newMessage = deepCopy<any>(message)
        this.logger.error(newMessage);
    }

    warn(message: any, ...optionalParams: any[]) {
        const newMessage = deepCopy<any>(message)
        this.logger.warn(newMessage);
    }

    debug(message: any, ...optionalParams: any[]) {
        const newMessage = deepCopy<any>(message)
        this.logger.debug(newMessage);
    }

    verbose(message: any, ...optionalParams: any[]) {
        const newMessage = deepCopy<any>(message)
        this.logger.verbose(newMessage);;
    }


    // Define your severity levels. 
    // With them, You can create log files, 
    // see or hide levels based on the running ENV.
    private levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        verbose: 5,
    }

    // This method set the current severity based on 
    // the current NODE_ENV: show all the log levels 
    // if the server was run in development mode; otherwise, 
    // if it was run in production, show only warn and error messages.
    private level = () => {
        const env = process.env.NODE_ENV || 'development'
        const isDevelopment = env === 'development'
        return isDevelopment ? 'debug' : 'warn'
    }

    // Define different colors for each level. 
    // Colors make the log message more visible,
    // adding the ability to focus or ignore messages.
    private colors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white',
        verbose: 'blue',
    }



    // Chose the aspect of your log customizing the log format.
    private consoleFormat = winston.format.combine(
        winston.format.prettyPrint(),
        // Tell Winston that the logs must be colored
        winston.format.colorize({ all: true }),
        winston.format.align(),
        winston.format.splat(),
        winston.format.simple(),
        // Define the format of the message showing the timestamp, the level and the message
        winston.format.printf(

            (info) => {
                if(Object.keys(info.metadata).length >= 1 && hasValues(info.metadata)){
                    return `${info.timestamp} - ${info.level}: ${
                        info.message
                      }.\nData is ${JSON.stringify(info.metadata)}`;
                }else{
                    if(info.message.constructor === Object){
                        info.message = JSON.stringify(info.message, null, 4)
                        return `${info.timestamp} - ${info.level}: ${
                            info.message
                          }`;
                    }else{
                        return `${info.timestamp} - ${info.level}: ${
                            info.message
                          }`;
                    }
                   
                }   
            }
        ),
    )

    // Chose the aspect of your log customizing the log format.
    private fileFormat = winston.format.combine(
        //winston.format.prettyPrint(),
        winston.format.json(),
        winston.format.align(),
        // Define the format of the message showing the timestamp, the level and the message

    )

    private defaultFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    )

    // Define which transports the logger must use to print out messages. 
    // In this example, we are using three different transports 
    private transports = [
        // Allow the use the console to print the messages
        new winston.transports.Console(
            {
                format: this.consoleFormat
            }
        ),
        // Allow to print all the error level messages inside the error.log file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: this.fileFormat
        }),
        new winston.transports.File({
            filename: 'logs/debug.log',
            level: 'debug',
            format: this.fileFormat
        }),
        new winston.transports.File({
            filename: 'logs/warn.log',
            level: 'warn',
            format: this.fileFormat
        }),
        // Allow to print all the error message inside the all.log file
        // (also the error log that are also printed inside the error.log(
        new winston.transports.File({
            filename: 'logs/all.log',
            format: this.fileFormat
        }),

        new DailyRotateFile({
            frequency: '7d',
            filename: 'logs/kkredit-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            format: this.fileFormat,
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '50d'
        })
    ]

}