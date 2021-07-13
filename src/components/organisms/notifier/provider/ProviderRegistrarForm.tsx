import TextField from '@material-ui/core/TextField'
import GridRow from 'components/atoms/GridRow'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'
import React, { FC, useContext } from 'react'
import CenteredContent from 'components/molecules/CenteredContent'
import RoundBtn from 'components/atoms/RoundBtn'
import GridItem from 'components/atoms/GridItem'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'
import { toChecksum, trailingSlashRegex } from 'utils/stringUtils'
import useErrorReporter from 'hooks/useErrorReporter'
import SubscriptionPlans from 'api/rif-notifier-service/subscriptionPlans'
import ProvidersService, { notifierProvidersAddress } from 'api/rif-marketplace-cache/notifier/providers'
import AppContext, { AppContextProps } from 'context/App'
import { NO_AVAILABLE_SUBSCRIPTION_PLAN, URL_ALREADY_REGISTERED } from 'constants/notifier/strings'

type Inputs = {
  endpointUrl: string
}

type ProviderRegistrarFormProps = {
  providerAddress: string
  isEnabled: boolean
  onRegister: (data: Inputs) => void
  buttonLabel?: string
}

const ProviderRegistrarForm: FC<ProviderRegistrarFormProps> = ({
  providerAddress, onRegister, isEnabled, buttonLabel,
}) => {
  const {
    register, handleSubmit, errors,
  } = useForm<Inputs>()
  const reportError = useErrorReporter()
  const {
    state: {
      apis: {
        [notifierProvidersAddress]: providersApi,
      },
    },
  } = useContext<AppContextProps>(AppContext)

  const validateProviderURL = async (url: string): Promise<boolean|string> => {
    const notifierService: SubscriptionPlans = new SubscriptionPlans(url)
    notifierService.connect(reportError)
    providersApi.connect(reportError)
    const providerService: ProvidersService = providersApi as ProvidersService
    const urlIsRegistered: boolean = await providerService.isRegisteredURL(url.replace(trailingSlashRegex, ''))
    const hasActivePlans: boolean|undefined = await notifierService.hasActivePlans()
    const urlMessage = urlIsRegistered ? URL_ALREADY_REGISTERED : ''
    const planMessage = hasActivePlans ? '' : NO_AVAILABLE_SUBSCRIPTION_PLAN

    return (!urlIsRegistered && hasActivePlans) || urlMessage || planMessage
  }

  return (
    <GridRow justify="center">
      <TitledRoundedCard
        title="General features"
        titleProps={{ variant: 'h6', color: 'primary', align: 'left' }}
        roundedCardProps={{ color: 'primary' }}
      >
        <CenteredContent>
          <form onSubmit={handleSubmit(onRegister)}>
            <GridRow spacing={3}>
              <GridItem xs={12}>
                <TextField
                  fullWidth
                  label="Provider address"
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  disabled
                  value={toChecksum(providerAddress)}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  fullWidth
                  label="Endpoint url"
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  inputRef={register({
                    required: true,
                    validate: { validateProviderURL },
                  })}
                  name="endpointUrl"
                />
                {
                  errors.endpointUrl && (
                    <Typography color="error" variant="caption">
                      { errors.endpointUrl.message || 'Endpoint url is required'}
                    </Typography>
                  )
                }
              </GridItem>
              <GridItem xs={12}>
                <GridRow justify="center" spacing={2}>
                  <RoundBtn type="submit" disabled={!isEnabled}>
                    {buttonLabel ?? 'Register Provider'}
                  </RoundBtn>
                  <Typography
                    color="secondary"
                    variant="subtitle1"
                    align="center"
                    gutterBottom
                  >
                    {`Your wallet will open and you will be asked to confirm
                   the transaction for listing your service.`}
                  </Typography>
                </GridRow>
              </GridItem>
            </GridRow>
          </form>
        </CenteredContent>
      </TitledRoundedCard>
    </GridRow>
  )
}

export default ProviderRegistrarForm
