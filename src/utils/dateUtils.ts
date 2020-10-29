import { PeriodInSeconds } from 'models/marketItems/StorageItem'

export const calcRenewalDate = (
  period: string,
  periodsCount: number,
  currentDate: Date,
): Date => {
  const periodInMillies = PeriodInSeconds[period] * 1000
  const periodsInMillies = periodInMillies * periodsCount
  return new Date(currentDate.getTime() + periodsInMillies)
}

export const getShortDateString = (date: Date): string => date
  .toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
