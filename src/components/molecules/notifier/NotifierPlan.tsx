import { Grid, Typography } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { fonts } from '@rsksmart/rif-ui'
import CurrencyToggle from 'components/atoms/CurrencyToggle'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import React, {
  FC, useMemo, useState,
} from 'react'
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
    borderRadius: '10px',
    maxWidth: '152px',
  },
  content: {
    maxHeight: '248px',
  },
  item: {
    flexBasis: 'auto',
  },
  text: {
    textAlign: 'center',
    textAlignLast: 'center',
  },
  smallText: {
    fontSize: fonts.size.small,
  },
  actions: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexFlow: 'column',
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

  const [
    selectedPriceOption,
    setSelectedOption,
  ] = useState<PriceOption>(priceOptions[0])

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
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} className={classes.item}>
            <Typography className={classes.text} color="primary" noWrap>
              {channels.join(' + ')}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <Typography
              className={classes.text}
              color="secondary"
              noWrap
              display="inline"
            >
              {limit}
            </Typography>
            {' '}
            <Typography
              className={`${classes.text} ${classes.smallText}`}
              color="secondary"
              noWrap
              display="inline"
            >
              Notifications
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <CurrencyToggle
              className={classes.text}
              options={currencyOptionSymbols}
              value={selectedSymbol}
              onChange={handleCurrencyChange}
            />
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <CombinedPriceCell
              className={classes.text}
              price={selectedPrice.toString()}
              priceFiat={selectedPrice.times(selectedRate).toString()}
              currency={selectedTokenName}
              currencyFiat={currentFiat}
              divider=""
            />
          </Grid>
          <Grid item xs={12} className={classes.item} wrap="nowrap">
            <Typography
              className={`${classes.text} ${classes.smallText}`}
              color="secondary"
              noWrap
              display="inline"
            >
              Valid for
              {' '}
              <Typography
                className={`${classes.text} ${classes.smallText}`}
                color="primary"
                noWrap
                display="inline"
              >
                {daysLeft}
                {' '}
                {`day${daysLeft !== 1 && 's'}`}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <SelectRowButton id={id} handleSelect={onSelectHandle}>
          Select
        </SelectRowButton>
      </CardActions>
    </Card>
  )
}

export default NotifierPlan
