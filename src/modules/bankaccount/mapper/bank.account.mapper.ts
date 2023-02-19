import { BankProfileDto } from "../dto/bank.account.dto";
import BankAccount, { IBankAccount } from "../model/bank.account.entity";

export function mapToBankAcount(bankAccountModel: BankProfileDto): IBankAccount {
    return new BankAccount({
        motherMaidenName: bankAccountModel.motherMaidenName,
        taxIdentificationNumber: bankAccountModel.taxIdentificationNumber,
        bvn: bankAccountModel.bvn,
        bvnIndex: bankAccountModel.bvnIndex,
        nin: bankAccountModel.nin,
        ninIndex: bankAccountModel.ninIndex,
        userImage: bankAccountModel.userImage,
        userId: bankAccountModel.userId
    })
}