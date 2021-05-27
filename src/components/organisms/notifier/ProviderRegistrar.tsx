import TextField from '@material-ui/core/TextField'
import GridRow from 'components/atoms/GridRow'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'
import React, { FC } from 'react'
import CenteredContent from 'components/molecules/CenteredContent'
import RoundBtn from 'components/atoms/RoundBtn'
import GridItem from 'components/atoms/GridItem'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'
import { toChecksum } from 'utils/stringUtils'
import useErrorReporter from 'hooks/useErrorReporter'
import SubscriptionPlans from 'api/rif-notifier-service/subscriptionPlans'

type Inputs = {
  endpointUrl: string
}

type ProviderRegistrarProps = {
  providerAddress: string
  isEnabled: boolean
  onRegister: (data: Inputs) => void
}

const ProviderRegistrar: FC<ProviderRegistrarProps> = ({
  providerAddress, onRegister, isEnabled,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const reportError = useErrorReporter()

  const validateProviderURL = (url: string): Promise<boolean> => {
    const notifierService: SubscriptionPlans = new SubscriptionPlans(url)
    notifierService.connect(reportError)

    return notifierService.hasPlans()
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
                      Endpoint URL is required
                    </Typography>
                  )
                }
              </GridItem>
              <GridItem xs={12}>
                <GridRow justify="center" spacing={2}>
                  <RoundBtn type="submit" disabled={!isEnabled}>
                    Register provider
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

export default ProviderRegistrar
