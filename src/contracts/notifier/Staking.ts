import Staking from '@rsksmart/rif-marketplace-notifier/build/contracts/Staking.json'
import { notifierStakingAddress, notifierSupportedTokens } from 'contracts/config'
import { TxOptions } from 'contracts/interfaces'
import { validateBalance } from 'contracts/utils/accountBalance'
import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'
import CustomError from 'models/CustomError'
import { convertToWeiString } from 'utils/parsers'
import { getTokensFromConfigTokens } from 'utils/tokenUtils'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'
import Big from 'big.js'
import { ZERO_BYTES } from 'constants/strings'

export type NotifierStakingContractErrorId = 'contract-notifier-staking'

class NotifierStakingContract extends ContractWithTokens {
  public static gasMultiplier = 1.1

  public static getInstance(web3: Web3): NotifierStakingContract {
    if (!NotifierStakingContract.instance) {
      NotifierStakingContract.instance = new NotifierStakingContract(
        web3,
        new web3.eth.Contract(
          Staking.abi as AbiItem[],
          notifierStakingAddress,
        ),
        getTokensFromConfigTokens(notifierSupportedTokens),
        'contract-notifier-staking',
      )
    }
    return NotifierStakingContract.instance
  }

  private static instance: NotifierStakingContract

  public async stake(
    amount: Big,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    if (Big(amount).lte(Big(0))) {
      throw new CustomError('The amount to stake should be greater then 0.')
    }

    const { from: account, token } = txOptions
    const { tokenAddress } = this.getToken(token)
    const amountWei = convertToWeiString(amount)

    await validateBalance({
      web3: this.web3, minAmountWei: amountWei, account, token,
    })

    const stakeTx = this.methods.stake(
      amountWei,
      tokenAddress,
      ZERO_BYTES,
    )

    return this.send(
      stakeTx,
      {
        gasMultiplier: NotifierStakingContract.gasMultiplier,
        ...txOptions,
        value: amountWei,
      },
    )
  }

  public unstake(
    amount: Big,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    if (Big(amount).lte(Big(0))) {
      throw new CustomError('The amount to unstake should be greater then 0.')
    }

    const { tokenAddress } = this.getToken(txOptions.token)
    const amountWei = convertToWeiString(amount)

    const unstakeTx = this.methods.unstake(
      amountWei,
      tokenAddress,
      ZERO_BYTES,
    )
    return this.send(
      unstakeTx,
      {
        gasMultiplier: NotifierStakingContract.gasMultiplier,
        ...txOptions,
      },
    )
  }
}

export default NotifierStakingContract
