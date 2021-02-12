import TextField from '@material-ui/core/TextField'
import GridRow from 'components/atoms/GridRow'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'
import React, { FC } from 'react'
import CenteredContent from 'components/molecules/CenteredContent'
import RoundBtn from 'components/atoms/RoundBtn'
import GridItem from 'components/atoms/GridItem'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'

type Inputs = {
  endpointUrl: string
  providerAddress: string
}

type ProviderRegistrarProps = {
  isEnabled: boolean
  onRegister: (data: Inputs) => void
}

const ProviderRegistrar: FC<ProviderRegistrarProps> = ({
  onRegister, isEnabled,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()

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
                  inputRef={register({ required: true })}
                  name="providerAddress"
                />
                {
                  errors.providerAddress && (
                    <Typography color="error" variant="caption">
                      Provider address is required
                    </Typography>
                  )
                }
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  fullWidth
                  label="Endpoint url"
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  inputRef={register({ required: true })}
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
