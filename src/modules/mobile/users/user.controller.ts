import {
    Controller, UseGuards, Body, Post, Request, HttpCode, HttpStatus, Patch,
    Req, Put, Param, UseInterceptors, UploadedFile, HttpException, Get, ParseFilePipeBuilder, UploadedFiles
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AppLogger } from 'src/core/logger/logger';
import { ApiKeyMiddleware } from 'src/core/middlewares/apikey.middleware';
import { ApiData } from 'src/core/model/api.data';
import { exclude } from 'src/core/utils/helpers/prisma.helper';
import { UserInfoDto } from './dto/user.info.dto';
import { UserPinChangeDto } from './dto/user.pin.update.dto';
import { UserUpdateInfoDto } from './dto/user.update.info.dto';
import { UsersService } from './users.service';

@Controller('customer/users')
export class UserController {
    constructor(
        private readonly userService: UsersService,
        private readonly appLogger: AppLogger
    ) { }

    @UseInterceptors(FileFieldsInterceptor([
        { name: 'identityFile', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
      ]))
    @Put('info')
    @HttpCode(HttpStatus.CREATED)
    async fillPersonalInfo(
        @UploadedFiles()files: { identityFile?: Express.Multer.File[], signature?: Express.Multer.File[] }, 
        @Body() user: UserInfoDto, @Request() req) {
  
        const updatedUser = await this.userService
            .createProfile(req.user.id, files.identityFile[0], files.signature[0], user)

        //This removes sensitive information     
        const userWithoutPinBvnNin = exclude(updatedUser, 'bvn', 'pin', 'nin', 'bvnIndex', 'ninIndex')

        // return the update user
        const data: ApiData = {
            success: true, message: "Profile Updated Successfully",
            payload: { user: userWithoutPinBvnNin }
        };
        return data
    }

    @Patch('info')
    async updateProfile(@Body() user: UserUpdateInfoDto, @Request() req) {
        const updatedUser = await this.userService.updateProfile(req.user.id, null, user);

        //This removes sensitive information     
        const userWithoutPinBvnNin = exclude(updatedUser, 'bvn', 'pin', 'nin', 'bvnIndex', 'ninIndex')

        // return the update user
        const data: ApiData = {
            success: true, message: "Profile Updated Successfully",
            payload: { user: userWithoutPinBvnNin }
        };
        return data
    }

    @Patch('change-pin')
    async changePin(@Body() user: UserPinChangeDto, @Request() req) {

        await this.userService.changePin(req.user.email, user);

        // return the update user
        const data: ApiData = {
            success: true, message: "Pin Updated Successfully",
            payload: {}
        };
        return data
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch('profile')
    @HttpCode(HttpStatus.CREATED)
    async updateProfileWithPicture(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: 'jpeg' || 'jpg' || 'png',
            })
            .addMaxSizeValidator({
                maxSize: 2500
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) image: Express.Multer.File,
        @Body() user: UserUpdateInfoDto, @Request() req) {
        const updatedUser = await this.userService.updateProfile(req.user.id, image, user);

        //This removes sensitive information     
        const userWithoutPinBvnNin = exclude(updatedUser, 'bvn', 'pin', 'nin', 'bvnIndex', 'ninIndex')

        // return the update user
        const data: ApiData = {
            success: true, message: "Profile Updated Successfully",
            payload: { user: userWithoutPinBvnNin }
        };
        return data
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch('image')
    @HttpCode(HttpStatus.CREATED)
    async uploadProfilePicture(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: 'jpeg' || 'jpg' || 'png',
            })
            .addMaxSizeValidator({
                maxSize: 2500
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) image: Express.Multer.File, @Request() req) {
        const user = await this.userService.uploadImage(req.user.id, image);

        //This removes sensitive information     
        const userWithoutPinBvnNin = exclude(user, 'bvn', 'pin', 'nin', 'bvnIndex', 'ninIndex')

        // return the update user
        const data: ApiData = {
            success: true, message: "Profile Picture Updated Successfully",
            payload: { user: userWithoutPinBvnNin }
        };
        return data
    }

    @Get('get')
    //@UseGuards(ApiKeyMiddleware)
    //@UseGuards(AuthGuard('Api-Key'))
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const profile = await this.userService.findOneById(req.user.id);
        this.appLogger.log(profile)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Profile Fetched Successfully",
            payload: { profile }
        };
        return data
    }

    @Get('identification-list')
    @HttpCode(HttpStatus.OK)
    async getIdentificationList() {
        const identificationList = await this.userService.getIdentificationList();
        this.appLogger.log(identificationList)

        // return Identification List
        const data: ApiData = {
            success: true, message: "Identification List Fetched Successfully",
            payload: identificationList
        };
        return data
    }


}
