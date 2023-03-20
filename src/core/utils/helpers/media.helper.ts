import path from "path";
import FileType from 'file-type';
import { InternalServerErrorException } from "@nestjs/common";
import { getErrorMessage } from "./error.helper";

export async function checkFileType(file: Express.Multer.File): Promise<boolean> {

    try {
        const whitelist = [
            'image/png',
            'image/jpeg',
            'image/jpg',
        ]
        // Allowed ext
        const filetypes = /jpeg|jpg|png/;
        // Check ext
        //const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            // const meta = await FileType.fromFile(file.path)

            // if (!whitelist.includes(meta.mime)) {
            //     return false
            // }
            return true;
        } else {
            false
        }
    } catch (error) {
        throw new InternalServerErrorException(getErrorMessage(error))
    }

}

export function checkFileSize(file: Express.Multer.File): void {

    // Check size
    const fileSize = file.size

    if (fileSize > 35000000) {
        {
            throw new InternalServerErrorException("File Should Be Less Than 3.5MB.")
        }
    }
}

export function checkMediaLink(fileLink: string): boolean {
    if (fileLink && fileLink.isNotEmptyOrNull() && fileLink.includes("res.cloudinary.com")) {
        return true;
    }
    return false;
}

export function isNotMediaLink(fileLink: string): boolean {
    if (fileLink && fileLink.isNotEmptyOrNull() && fileLink.includes("res.cloudinary.com")) {
        return false;
    }
    return true;
}