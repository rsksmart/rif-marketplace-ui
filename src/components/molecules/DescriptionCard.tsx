import { makeStyles, Paper } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import React, {
  FC,
} from 'react'

const useStyles = makeStyles({
  root: {
    background: colors.gray1,
    paddingLeft: '41px',
    paddingTop: '18px',
    paddingBottom: '28px',
  },
})

const DescriptionCard: FC = ({ children }) => (
  <Paper
    elevation={0}
    classes={useStyles()}
  >
    { children }
    {' '}

  </Paper>
)

export default DescriptionCard
