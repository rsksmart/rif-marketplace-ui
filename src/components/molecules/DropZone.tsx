import {
  makeStyles, Theme, Typography, Button, ButtonBaseProps,
} from '@material-ui/core'
import React, { FC } from 'react'
import GridColumn from 'components/atoms/GridColumn'
import { colors } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone'

const useStylesDropZone = makeStyles((theme: Theme) => ({
  root: {
    borderRadius: theme.spacing(1.2),
    border: '1px dashed #CFD3DA',
    boxSizing: 'border-box',

    width: '296px',
    height: '118px',

    marginLeft: '48px',
    marginRight: '48px',
  },
  button: {
    color: colors.primary,
    border: `solid 1px ${colors.primary}`,
    borderRadius: '5px',
  },
}))

const DropZone: FC<DropzoneAreaProps> = (props) => {
  const classes = useStylesDropZone()

  return (
    <GridColumn
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <DropzoneArea {...props} />
    </GridColumn>
  )
}

export default DropZone
