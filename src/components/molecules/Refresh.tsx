import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { IconButtonProps } from '@material-ui/core/IconButton'
import { TooltipIconButton } from '@rsksmart/rif-ui'
import RefreshIcon from '@material-ui/icons/Refresh'

export type RefreshProps = IconButtonProps & { title: string }

const Refresh: FC<RefreshProps> = ({ title, ...iconButtonProps }) => (
  <Typography component="div" align="right">
    <Box
      color="text.secondary"
      display="inline"
    >
      {title}
    </Box>
    <TooltipIconButton
      icon={<RefreshIcon />}
      tooltipTitle="Refresh"
      iconButtonProps={iconButtonProps}
    />
  </Typography>
)

export default Refresh
