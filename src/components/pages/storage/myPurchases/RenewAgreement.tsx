import React, { ChangeEvent, FC, useContext } from 'react'
import { TextField, Typography } from '@material-ui/core'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import StoragePurchaseCard, { StoragePurchaseCardDetails } from 'components/organisms/storage/buy/StoragePurchaseCard'
import withRenewContext, {
  initialState, StorageRenewContext, StorageRenewContextProps,
} from 'context/storage/mypurchases/renew'
import RifSelect from 'components/molecules/RifSelect'
import { CombinedPriceCell } from 'components/molecules'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import RoundBtn from 'components/atoms/RoundBtn'

const RenewAgreement: FC = () => {
  const history = useHistory()
  const {
    state: {
      auxiliary: {
        plan,
        currentFiat: {
          displayName: fiatName,
        },
        currentRate,
        periodsCount,
        endDate,
        totalFiat,
      },
      order,
      status,
    }, dispatch,
    asyncActions: {
      renewAgreement,
    },
  } = useContext<StorageRenewContextProps>(StorageRenewContext)

  if (!order) return null

  const { total, ...agreement } = order

  const changePeriodCountHandle = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => dispatch({
    type: 'SET_AUXILIARY',
    payload: {
      periodsCount: parseInt(value, 10) || initialState.auxiliary.periodsCount,
    },
  })

  const navToMyPurchases = (): void => history.replace(
    ROUTES.STORAGE.MYPURCHASES.BASE,
  )
  const navToStorageBase = (): void => history.replace(
    ROUTES.STORAGE.BUY.BASE,
  )

  const agreementDetails: StoragePurchaseCardDetails = {
    'CONTENT SIZE': `${agreement.size} MB`,
    'CURRENCY TO PAY': <RifSelect<string>
      id="currency"
      value={0}
      options={[agreement.paymentToken.displayName]}
      disabled
    />,
    'SUBSCRIPTION PERIOD': <RifSelect<JSX.Element>
      id="plan"
      value={0}
      options={[
        <PlanOption
          plan={plan}
          xr={{
            fiat: fiatName,
            rate: currentRate,
          }}
          key={JSON.stringify(plan)}
        />,
      ]}
      disabled
    />,
    'PERIODS TO PREPAY': <TextField
      type="number"
      value={periodsCount.toString()}
      InputProps={{
        inputProps: { min: 1 },
      }}
      onChange={changePeriodCountHandle}
    />,
    'TOTAL PRICE': total && totalFiat
? (
      <CombinedPriceCell
        currency={agreement.paymentToken.displayName}
        currencyFiat={fiatName}
        price={total.toFixed(18)}
        priceFiat={totalFiat}
        divider={<br />}
      />
    )
: null,
    'RENEWAL DATE': endDate,
  }

  return (
    <CheckoutPageTemplate
      className="storage-renew-page"
      backButtonProps={{
        backTo: 'my purchases',
      }}
    >

      <GridColumn>
        <GridItem spacing={3}>
          <Typography variant="caption" color="secondary">To renew your contract you have to select the suscription and payment details to get the final price of your storage plan.</Typography>
        </GridItem>
        <GridItem>
          <GridColumn alignContent="center">
            <GridItem>
              <StoragePurchaseCard
                details={agreementDetails}
                title="Renewing storage agreement"
                submitProps={{
                  onClick: renewAgreement,
                  children: 'Renew',
                }}
              />
            </GridItem>
          </GridColumn>
        </GridItem>

      </GridColumn>
      <ProgressOverlay
        title="Renewing agreement!"
        doneMsg="Your agreement has been renewed."
        {...status}
        buttons={[
          <RoundBtn onClick={navToMyPurchases} key="prog-purchase">
            View my purchases
          </RoundBtn>,
          <RoundBtn onClick={navToStorageBase} key="prog-listing">
            View storage listing
          </RoundBtn>,
        ]}
      />
    </CheckoutPageTemplate>
  )
}

export default withRenewContext(RenewAgreement)
