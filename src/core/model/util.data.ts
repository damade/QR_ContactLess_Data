import { IBankAccount } from "src/modules/bankaccount/model/bank.account.entity";
import { IBvn } from "src/modules/bvn/model/bvn.entity";
import { IUser } from "src/modules/users/model/user.entity";

export type Nullable<T> = T | undefined | null;

export type BankAccountCreationData = {
    user: IUser,
    bankInfo: IBankAccount,
    bvnInfo?: IBvn,
}

export type BvnCreationData = {
    user: IUser,
    bvnInfo: IBvn,
}