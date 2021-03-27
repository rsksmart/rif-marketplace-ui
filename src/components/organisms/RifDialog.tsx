import React, { FC } from 'react'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import { theme } from '@rsksmart/rif-ui'
import { Modify } from 'utils/typeUtils'
import ClearIcon from '@material-ui/icons/Clear'

const StyledDialog = withStyles({
  root: {
    '& > .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: 20,
    minWidth: '549px',
    minHeight: '360px',
  },
})(Dialog)

const StyledIconButton = withStyles({
  root: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '1em',
    height: '1em',
    color: theme.palette.text.secondary.toString(),
  },
})(IconButton)

type Props = Modify<DialogProps, {
  onClose: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}>

const RifDialog: FC<Props> = ({ onClose, children, ...props }) => (
  <StyledDialog {...props} onClose={onClose} maxWidth="lg">
    <StyledIconButton onClick={onClose}>
      <ClearIcon />
    </StyledIconButton>
    { children }
  </StyledDialog>
)

export default RifDialog
