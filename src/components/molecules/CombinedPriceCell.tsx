import React, { FC } from 'react'
import PriceItem from 'components/atoms/PriceItem';

export interface CombinedPriceCellProps {
  className?: string
  divider?: string | React.ElementType
  price: string
  currency: string
  price_fiat: string
  currency_fiat: string
}

const CombinedPriceCell: FC<CombinedPriceCellProps> = ({ className = '', divider, price, currency, price_fiat, currency_fiat }) => {
  return <div className={('priceCell ' + className).trim()}>
    <PriceItem key='hola' type='crypto' price={price} currency={currency} />
    {!!divider && divider}
    <PriceItem type='fiat' price={price_fiat} currency={currency_fiat} />
  </div>
}

export default CombinedPriceCell;