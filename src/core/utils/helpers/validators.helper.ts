import { BadRequestException, HttpException, HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import { getErrorMessage } from "./error.helper";

export const validateLoginCredentials = (data: {username: string, password: string}) => {
    try {
        if (!data.password || data.password == " "){
            throw new UnprocessableEntityException("Pin can not be empty")
        }else if(!data.username || data.username == " "){
            throw new UnprocessableEntityException("Phone number can not be empty")
        }else if (data.password.length != 6){
            throw new UnprocessableEntityException("Pin Length should be 6")
        }//Negates the check valid phonenumber
        else if(!(data.username.startsWith("0") || data.username.startsWith("234"))){
            throw new UnprocessableEntityException("Invalid Phone Number")        
        }else if(data.username.startsWith("0") && data.username.length != 11){
            throw new UnprocessableEntityException("Phone Number length should be 11")        
        }else if(data.username.startsWith("234") && data.username.length != 13){
            throw new UnprocessableEntityException("Phone Number length should be 13")        
        }
         // perform more checks
  
    return true;  
    } catch (error) {
        if (error instanceof UnprocessableEntityException){
            throw new UnprocessableEntityException(getErrorMessage(error));
         }else if(error instanceof BadRequestException){
             throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST)
         }else{
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
  };