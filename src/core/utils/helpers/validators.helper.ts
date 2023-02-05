import { BadRequestException, HttpException, HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import { getErrorMessage } from "./error.helper";

export const validateLoginCredentials = (data: { phoneNumber: string, password: string, email: string }) => {
    try {
        if (data.password.isEmptyOrNull()) {
            throw new UnprocessableEntityException("Password can not be empty")
        } else if (data.phoneNumber.isEmptyOrNull() && data.email.isEmptyOrNull()) {
            throw new UnprocessableEntityException("Phone number and email can not be empty")
        } else if (data.password.length <= 6) {
            throw new UnprocessableEntityException("Password Length should be more than 6")
        } else if (data.phoneNumber.isNotEmptyOrNull()) {
            validatePhoneNumber(data.phoneNumber)
        } else if (!validateEmail(data.email)) {
            throw new UnprocessableEntityException("Email does not match acceptable pattern.")
        }
        return true;
    } catch (error) {
        if (error instanceof UnprocessableEntityException) {
            throw new UnprocessableEntityException(getErrorMessage(error));
        } else if (error instanceof BadRequestException) {
            throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST)
        } else {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
};

const validatePhoneNumber = (phoneNumber: string) => {
    //Negates the check valid phonenumber
    if (!(phoneNumber.startsWith("0") || phoneNumber.startsWith("234"))) {
        throw new UnprocessableEntityException("Invalid Phone Number")
    } else if (phoneNumber.startsWith("0") && phoneNumber.length != 11) {
        throw new UnprocessableEntityException("Phone Number length should be 11")
    } else if (phoneNumber.startsWith("234") && phoneNumber.length != 13) {
        throw new UnprocessableEntityException("Phone Number length should be 13")
    }
}

export const validateEmail = (email: string) => {
    var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
    var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
    var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
    var sQuotedPair = '\\x5c[\\x00-\\x7f]';
    var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
    var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
    var sDomain_ref = sAtom;
    var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
    var sWord = '(' + sAtom + '|' + sQuotedString + ')';
    var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
    var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
    var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
    var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

    var reValidEmail = new RegExp(sValidEmail);

    return reValidEmail.test(email)
}