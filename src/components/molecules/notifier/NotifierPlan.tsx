import React, {
  FC, useMemo, useState,
} from 'react'
import { Typography } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CurrencyToggle from 'components/atoms/CurrencyToggle'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import { CombinedPriceCell, SelectRowButton } from '..'

type NotifierPlanProps = NotifierOfferItem & {
    onSelect: (priceOption: PriceOption) => void
    currentFiat: string
    crypto: MarketCryptoRecord
}

const useCardStyles = makeStyles(() => ({
  root: {
    border: '1px solid #CFD3DA',
    boxShadow: 'none',
  },
  actions: {
    justifyContent: 'center',
  },
}))

type CurrencyOptions = Partial<{
  [key in SupportedTokenSymbol]: PriceOption
}>

const NotifierPlan: FC<NotifierPlanProps> = ({
  id,
  channels,
  limit,
  daysLeft,
  priceOptions,
  onSelect,
  currentFiat,
  crypto,
}) => {
  const classes = useCardStyles()

  const [selectedPriceOption, setSelectedOption] = useState<PriceOption>(priceOptions[0])

  const {
    token: {
      symbol: selectedSymbol,
      displayName: selectedTokenName,
    },
    value: selectedPrice,
  } = selectedPriceOption

  const currencyOptions: CurrencyOptions = useMemo(() => priceOptions
    .reduce((acc, option) => {
      acc[option.token.symbol] = option
      return acc
    }, {}), [priceOptions])

  const currencyOptionSymbols = useMemo(() => Object
    .keys(currencyOptions) as SupportedTokenSymbol[], [currencyOptions])

  const onSelectHandle = (): void => onSelect(selectedPriceOption)

  const handleCurrencyChange = (
    _: unknown,
    symbol: SupportedTokenSymbol,
  ): void => {
    const selectedOption = currencyOptions[symbol]

    if (selectedOption) setSelectedOption(selectedOption)
  }

  const selectedRate = crypto?.[selectedSymbol]?.rate || 0

  return (
    <Card classes={classes}>
      <CardContent>
        <GridColumn spacing={1} wrap="nowrap">
          <GridItem xs={2}>
            <Typography>
              {channels.join(' + ')}
            </Typography>
          </GridItem>
          <GridItem xs={2}>
            <Typography>
              {limit}
              {' '}
              Notifications
            </Typography>
          </GridItem>
          <GridItem xs={2}>
            <CurrencyToggle
              options={currencyOptionSymbols}
              value={selectedSymbol}
              onChange={handleCurrencyChange}
            />
          </GridItem>
          <GridItem xs={2}>
            <CombinedPriceCell
              price={selectedPrice.toString()}
              priceFiat={selectedPrice.times(selectedRate).toString()}
              currency={selectedTokenName}
              currencyFiat={currentFiat}
              divider={<br />}
            />
          </GridItem>
          <GridItem xs={2}>
            <Typography>
              Valid for
              {' '}
              {daysLeft}
              {' '}
              day(s)
            </Typography>
          </GridItem>
        </GridColumn>
      </CardContent>
      <CardActions>
        <SelectRowButton id={id} handleSelect={onSelectHandle}>
          Select
        </SelectRowButton>
      </CardActions>
    </Card>
  )
}

export default NotifierPlan
