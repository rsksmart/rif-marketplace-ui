import React, { FC, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { SupportedTokens, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'

export interface DepositModalProps {
  currentBalance: string
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, currency: SupportedTokens) => void
}
const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyContainer: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '80%',
    },
  },
  bodyChild: {
    padding: theme.spacing(2, 0),
  },
  currencySelectContainer: {
    display: 'flex',
  },
}))

// TODO: read current balances as an array to handle multicurrency
const DepositModal: FC<DepositModalProps> = ({
  currentBalance, open, onClose, onDeposit,
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedTokens[] = ['rbtc', 'rif']
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedTokens>('rbtc')
  const [amountToStake, setAmountToStake] = useState<number | undefined>(undefined)

  const handleCurrencyChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setSelectedCurrency(value as SupportedTokens)

  const handleAmountChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setAmountToStake(value as number)

  const handleDeposit = () => onDeposit(Number(amountToStake), selectedCurrency)

  const actions: JSX.Element = (
    <Button
      color="primary"
      rounded
      variant="contained"
      onClick={handleDeposit}
      disabled={!amountToStake || amountToStake <= 0}
    >
      Stake Funds
    </Button>
  )

  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Stacking"
      footer={actions}
    >
      <Grid
        container
        direction="column"
        alignContent="center"
      >
        <div className={classes.bodyContainer}>
          <Typography
            className={classes.bodyChild}
            component="div"
            align="center"
            color="secondary"
          >
            {'The amount of RIF staked in RIF Marketplace helps to '}
            <Box fontWeight="fontWeightMedium" display="inline">
              enhance your reputation
            </Box>
            {' and '}
            <Box fontWeight="fontWeightMedium" display="inline">
              position your offers at the top
            </Box>
            {' when selling storage.'}
          </Typography>
          <Divider />
          <Typography
            className={classes.bodyChild}
            component="div"
            color="secondary"
            align="center"
          >
            {'Your current balance is '}
            <Box display="inline" fontWeight="fontWeightMedium">
              {currentBalance}
            </Box>
          </Typography>
          <Divider />
          <Grid
            className={classes.bodyChild}
            container
            justify="center"
          >
            <Grid item>
              <TextField
                required
                fullWidth
                type="number"
                label="Amount to stake"
                id="amount-to-stake"
                value={amountToStake || ''}
                error={!amountToStake || amountToStake <= 0}
                inputProps={{
                  min: '0',
                  style: { textAlign: 'center' },
                }}
                onChange={handleAmountChange}
              />
            </Grid>
            <Grid
              item
              className={classes.currencySelectContainer}
            >
              <Select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                variant="standard"
                color="secondary"
              >
                {currencyOptions.map(
                  (option: SupportedTokens) => (
                    <MenuItem key={option as string} value={option}>
                      {tokenDisplayNames[option]}
                    </MenuItem>
                  ),
                )}
              </Select>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </ModalDialogue>
  )
}

export default DepositModal
