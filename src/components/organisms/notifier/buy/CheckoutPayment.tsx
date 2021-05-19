import RoundBtn from 'components/atoms/RoundBtn'
import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import GridRow from 'components/atoms/GridRow'
import GridItem from 'components/atoms/GridItem'
import Grid from '@material-ui/core/Grid'

type Props = {
  onBuy: () => void
}

const CheckoutPayment: FC<Props> = ({ onBuy }) => (
  <>
    <GridRow>
      <GridItem md={4} sm={12}>
        <p>Select currency</p>
      </GridItem>
      <GridItem md={4} sm={12}>
        <p>See final price</p>
        <p>See expiration date</p>
      </GridItem>
      <Grid container item md={4} sm={12} justify="center">
        <RoundBtn onClick={onBuy}>Buy</RoundBtn>
        <Typography
          color="secondary"
          variant="subtitle1"
          align="center"
        >
          {`Your wallet will open and you will be asked
               to confirm the transaction for buying the notification plan.`}
        </Typography>
      </Grid>
    </GridRow>
  </>
)

export default CheckoutPayment
