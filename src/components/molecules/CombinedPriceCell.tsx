import React, { FC } from 'react'
import PriceItem from 'components/atoms/PriceItem'

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
  const cappedDecimalsFiat = parseFloat(priceFiat).toFixed(4).toString()

  return (
    <div className={(`priceCell ${className}`).trim()}>
      <PriceItem key="hola" type="crypto" price={price} currency={currency} />
      {!!divider && divider}
      <PriceItem type="fiat" price={cappedDecimalsFiat} currency={currencyFiat} />
    </div>
  )
}

export default CombinedPriceCell
