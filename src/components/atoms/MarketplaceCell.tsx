import Typography, { TypographyProps } from '@material-ui/core/Typography/Typography'
import React, { FC } from 'react'

const MarketplaceCell: FC<TypographyProps> = ({ children, ...props }) => (
  <Typography color="textSecondary" variant="body2" {...props}>
    {children}
  </Typography>
)

export default MarketplaceCell
