import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui'
import { FEATURE_NOT_SUPPORTED } from 'constants/strings'
import { logNotImplemented } from 'utils/utils'
import { Tooltip } from '@material-ui/core'

interface Props {
  message: string
}

const FeatureNotSupported: FC<Props> = ({ message, children }) => (
  <Tooltip title={FEATURE_NOT_SUPPORTED}>
    <span>
      <Button disabled variant="outlined" color="primary" rounded onClick={logNotImplemented(message)}>
        {children}
      </Button>
    </span>
  </Tooltip>

)

export default FeatureNotSupported
