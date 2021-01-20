import { TransactionOptions } from '../interfaces'

export interface PaymentWrapper {
    getBalanceOf: (
        account: string,
        txOptions: TransactionOptions
    ) => Promise<number | string>
}
