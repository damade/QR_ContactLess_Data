import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as dotenv from 'dotenv';
dotenv.config();
import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import { getErrorMessage } from "../helpers/error.helper";
import { Readable } from "stream";
import { AppLogger } from "src/core/logger/logger";
import { getCloudinaryPublicId } from "../helpers/string.helper";
import { checkFileSize, checkFileType } from "../helpers/media.helper";


cloudinary.config({
  cloud_name: "dxi9rgcur",
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinarySecretKey,
});


@Injectable()
export class MediaService {

  // private storage = CloudinaryStorage({
  //     cloudinary,
  //     params: {
  //         folder: 'Kkredit',
  //         allowedFormats: ["jpg", "png", "jpeg"],
  //     },
  // });

  constructor(
    private readonly appLogger: AppLogger
  ) { }

  async uploadImage(fileToUpload: Express.Multer.File): Promise<string> {
    try {
      if (fileToUpload === null || fileToUpload.originalname == null || fileToUpload.originalname == "") {
        throw new HttpException(`Please input a file ${fileToUpload.originalname }`, HttpStatus.BAD_REQUEST);
      }

     await checkFileType(fileToUpload)
      .then(isTrue => {
          if(!isTrue){
            throw new HttpException("File must be jpeg or jpg or png", HttpStatus.BAD_REQUEST);  
          }
          checkFileSize(fileToUpload)
      }).catch(error =>
        {
          this.appLogger.log(error)
          throw new InternalServerErrorException(getErrorMessage(error))
        }
        )

      const internalResult = await this.internalUploadImage(fileToUpload).catch(error => {
        throw new BadRequestException(getErrorMessage(error))
      })

      if (!internalResult.secure_url) {
        throw new BadRequestException(internalResult.message)
      }

      this.appLogger.log(internalResult.public_id)
      return internalResult.secure_url

      //    await cloudinary.uploader.upload(
      //         file.originalname,
      //         {
      //             folder: process.env.CLOUDINARY_FOLDER_NAME,
      //             use_filename: true,
      //             quality: "auto:low",
      //         },
      //         (err, result) => {
      //             if (err) {
      //                 console.log(err);
      //                 const { message, http_code, name } = err;
      //                 throw new HttpException(message, http_code);
      //             }
      //             const { secure_url, public_id } = result;
      //             const path = secure_url;
      //             return path
      //         }
      //     );
      //     return 
    } catch (e) {
      throw new HttpException(getErrorMessage(e), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async uploadImageAndDelete(fileToUpload: Express.Multer.File, imageUrl: string): Promise<string> {
    try {
      if (fileToUpload === null || fileToUpload.originalname == null || fileToUpload.originalname == "") {
        throw new HttpException("Please input a file", HttpStatus.BAD_REQUEST);
      }

      checkFileType(fileToUpload)
      .then(isTrue => {
          if(!isTrue){
            throw new HttpException("File must be jpeg or jpg or png", HttpStatus.BAD_REQUEST);  
          }
      }).catch(error =>
        {
          throw new InternalServerErrorException(getErrorMessage(error))
        }
        )

      const internalResult = await this.internalUploadImage(fileToUpload).catch(error => {
        throw new BadRequestException(getErrorMessage(error))
      })

      if (!internalResult.secure_url) {
        throw new BadRequestException(internalResult.message)
      }

      if(imageUrl){
        this.deleteImage(imageUrl)
      }

      this.appLogger.log(internalResult.public_id)
      return internalResult.secure_url

     
     
    } catch (e) {
      throw new HttpException(getErrorMessage(e), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async deleteImage(imageUrl: string): Promise<string> {
    try {
      const publicId = getCloudinaryPublicId(imageUrl);
      const internalResult = await this.internalImageDeleter(publicId).catch(error => {
        throw new BadRequestException(getErrorMessage(error))
      })
      return internalResult
    } catch (e) {
      throw new HttpException(getErrorMessage(e), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }


 private async internalUploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error)
        };
        resolve(result);
      });
      Readable.from(file.buffer).pipe(upload); // covert buffer to readable stream and pass to upload
    });
  }

 private async internalImageDeleter(
    publicId: string,
  ) {
    return cloudinary.uploader.destroy(publicId, function (result) { 
      this.appLogger.log(result) 
      return result
    });
  }
}