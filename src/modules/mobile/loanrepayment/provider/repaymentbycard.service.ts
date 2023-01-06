import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoanTransferRepayment } from "@prisma/client";
import { getErrorMessage } from "src/core/utils/helpers/error.helper";
import { MediaService } from "src/core/utils/service/media.service";
import { TransactionService } from "src/modules/public/transaction/transaction.service";
import { RepaymentByCardDto } from "../dto/repaymentbycard.dto";
import { RepaymentByTransferDto } from "../dto/repaymentbytransfer.dto";
import { LoanTransferRepaymentPrismaService } from "../service/loantransferrepayment.prisma.service";


@Injectable()
export class LoanRepaymentByCardService {

    constructor(private readonly loanTransferService: LoanTransferRepaymentPrismaService,

        private readonly transactionService: TransactionService,) { }

    async addLoanRepaymentByTransfer(id: string, loanRepaymentRequest: RepaymentByCardDto): Promise<LoanTransferRepayment | null> {
        try {
            //Check if transaction reference works fine.

            /**
             * authorization_code: string, email: string, amount: string
             * @param authCode
             * @param email
             * @param amount
             */
            const transaction = await this.transactionService
                .chargeAuthorization(loanRepaymentRequest.authCode, 
                    loanRepaymentRequest.email, loanRepaymentRequest.amount)
                .catch(err => {
                    const newError = JSON.parse(err.message)
                    throw new HttpException(newError.message, newError.statusCode);
                })

            if (!transaction.data) {
                throw new HttpException("Transaction could not be verified or completed", HttpStatus.NOT_FOUND)
            }

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }




}
