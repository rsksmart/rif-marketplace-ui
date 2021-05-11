import React, { FC } from 'react'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { priceDisplay } from 'utils/utils'
import useDisabledStyle from 'hooks/useDisabledStyle'

export interface CombinedPriceCellProps {
  className?: string
  divider?: string | JSX.Element
  price: string
  currency: string
  priceFiat: string
  currencyFiat: string
  disabled?: boolean
}

const CombinedPriceCell: FC<CombinedPriceCellProps> = ({
  className = '', disabled,
  divider, price, currency,
  priceFiat, currencyFiat,
}) => {
  const cappedDecimalsFiat = priceDisplay(parseFloat(priceFiat), 4)
  const disabledStyle = useDisabledStyle()
  const disabledClass = disabled ? disabledStyle.root : ''

  return (
    <div className={(`priceCell ${className} ${disabledClass}`).trim()}>
      <ItemWUnit type="mediumPrimary" value={price} unit={currency} />
      {!!divider && divider}
      <ItemWUnit type="normalGrey" value={cappedDecimalsFiat} unit={currencyFiat} />
    </div>
  )
}

export default CombinedPriceCell
