import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoanTransferRepayment } from "@prisma/client";
import { getErrorMessage } from "src/core/utils/helpers/error.helper";
import { MediaService } from "src/core/utils/service/media.service";
import { RepaymentByTransferDto } from "../dto/repaymentbytransfer.dto";
import { LoanTransferRepaymentPrismaService } from "../service/loantransferrepayment.prisma.service";


@Injectable()
export class LoanRepaymentByTransferService {

    constructor(private readonly loanTransferService: LoanTransferRepaymentPrismaService,
        private readonly mediaService: MediaService) { }

    async addLoanRepaymentByTransfer(id: string, paymentFile: Express.Multer.File,
        loanRepaymentRequest: RepaymentByTransferDto): Promise<LoanTransferRepayment | null> {

        try {
            if (!paymentFile) {
                throw new HttpException("Please add your NIN/Voters Card image for Identity", HttpStatus.BAD_REQUEST);
            }
            
            var fileLink = await this.mediaService.uploadImage(paymentFile)
                .catch(
                    error => {
                        throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                    });

            return await this.loanTransferService.createTransferRepayment(
                {
                    referenceNumber: loanRepaymentRequest.referenceNumber,
                    repaymentAmount: loanRepaymentRequest.repaymentAmount, 
                    receiptUrl: fileLink,
                    transactionDate: loanRepaymentRequest.transactionDate,
                    loanInfo:{
                        connect: {uniqueId: loanRepaymentRequest.loanUniqueId}
                    }
                }
            ).catch(
                error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

   


}
