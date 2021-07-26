import React, { FC } from 'react'
import { FEATURE_NOT_SUPPORTED } from 'constants/strings'
import Tooltip from '@material-ui/core/Tooltip'
import RoundBtn from './RoundBtn'

const FeatureNotSupported: FC<{}> = ({ children }) => (
  <Tooltip title={FEATURE_NOT_SUPPORTED}>
    <span>
      <RoundBtn disabled>
        {children}
      </RoundBtn>
    </span>
  </Tooltip>

)

export default FeatureNotSupported
