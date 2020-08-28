import React, { FC } from 'react'
import { colors } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

export interface LabelWithValueProps {
  label: string
  value: string
}

const useStyles = makeStyles(() => ({
  label: {
    color: colors.gray5,
  },
}))

// TODO: move to rif-ui
const LabelWithValue: FC<LabelWithValueProps> = ({ label, value }) => {
  const classes = useStyles()
  return (
    <Typography component="div" align="center" color="secondary">
      <Box display="inline" className={classes.label}>
        {label}
        {' '}
      </Box>
      {value}
    </Typography>
  )
}

export default LabelWithValue
