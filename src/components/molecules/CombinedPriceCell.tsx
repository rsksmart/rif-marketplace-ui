import React, { FC } from 'react'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { priceDisplay } from 'utils/utils'

export interface CombinedPriceCellProps {
  className?: string
  divider?: string | React.ElementType
  price: string
  currency: string
  priceFiat: string
  currencyFiat: string
}

const CombinedPriceCell: FC<CombinedPriceCellProps> = ({
  className = '', divider, price, currency, priceFiat, currencyFiat,
}) => {
  const cappedDecimalsFiat = priceDisplay(parseFloat(priceFiat), 4)

  return (
    <div className={(`priceCell ${className}`).trim()}>
      <ItemWUnit type='mediumPrimary' value={price} unit={currency} />
      {!!divider && divider}
      <ItemWUnit type='normalGrey' value={cappedDecimalsFiat} unit={currencyFiat} />
    </div>
  )
}

export default CombinedPriceCell
