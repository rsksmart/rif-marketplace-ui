import {
  StorageBillingPlan,
  TokenAddressees,
} from 'context/Market/storage/interfaces'
import {
  BillingPlan,
  PeriodInSeconds,
  StorageOffer,
} from 'models/marketItems/StorageItem'
import { convertToWeiString } from 'utils/parsers'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { asciiToHex } from 'web3-utils'
import { Big } from 'big.js'
import { OfferContractData } from './interfaces'

export function prefixArray(
  arr: string[],
  prefix: string,
  lengthPerElement = 32,
): string[] {
  if (prefix.length >= lengthPerElement) {
    throw new Error(`Too long prefix! Max ${lengthPerElement} chars!`)
  }

  const endingLength = lengthPerElement - prefix.length

  let tmp
  let carryOver = prefix
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > lengthPerElement) {
      throw new Error(`Element ${i} was longer then expected!`)
    }

    tmp = `${carryOver}${arr[i].slice(0, endingLength)}`
    carryOver = arr[i].slice(endingLength)
    // eslint-disable-next-line no-param-reassign
    arr[i] = tmp
  }

  if (carryOver) {
    arr.push(carryOver)
  }

  return arr
}

export function encodeHash(hash: string): string[] {
  if (hash.length <= 32) {
    return [asciiToHex(hash)]
  }

  return [asciiToHex(hash.slice(0, 32)), ...encodeHash(hash.slice(32))]
}

export const transformOfferDataForContract = (
  availableSizeGB: number,
  billingPlans: StorageBillingPlan[],
  originalOffer?: StorageOffer,
): OfferContractData => {
  const availableSizeMB = new Big(availableSizeGB)
    .mul(UNIT_PREFIX_POW2.KILO)
    .toString()

  const resultsBillingPlan = [...billingPlans]

  if (originalOffer) {
    // gets the billing plans with period or currency no longer in the offer
    const difference = originalOffer.subscriptionOptions.filter(
      (originalSub) => !resultsBillingPlan.some(
        (newSub) => originalSub.period === newSub.period
            && originalSub.currency === newSub.currency,
      ),
    )

    difference.forEach((removedPlan: BillingPlan) => {
      resultsBillingPlan.push({
        ...removedPlan,
        price: new Big(0),
      })
    })
  }

  const { prices, periods, tokens } = resultsBillingPlan.reduce(
    (acc, { period, price, currency }) => {
      const tokenIndex = acc.tokens.findIndex((t) => t === currency)
      const weiPrice = convertToWeiString(
        new Big(price).div(UNIT_PREFIX_POW2.KILO),
      )

      if (tokenIndex !== -1) {
        acc.periods[tokenIndex].push(PeriodInSeconds[period])
        acc.prices[tokenIndex].push(weiPrice)
        return acc
      }

      return {
        prices: [...acc.prices, [weiPrice]],
        periods: [...acc.periods, [PeriodInSeconds[period]]],
        tokens: [...acc.tokens, TokenAddressees[currency]],
      }
    },
    { prices: [], periods: [], tokens: [] } as any,
  )
  return {
    availableSizeMB,
    prices,
    periods,
    tokens,
  }
}
