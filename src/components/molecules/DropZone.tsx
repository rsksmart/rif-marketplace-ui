import {
  makeStyles, Theme, Typography, Button, ButtonBaseProps,
} from '@material-ui/core'
import React, { FC } from 'react'
import GridColumn from 'components/atoms/GridColumn'
import { colors } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'

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

export type DropZoneProps = Pick<ButtonBaseProps, 'onClick'>

const DropZone: FC<DropZoneProps> = ({ ...props }) => {
  const classes = useStylesDropZone()
  return (
    <GridColumn
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <GridItem>
        <Typography color="textSecondary">Drag & Drop files here</Typography>
      </GridItem>
      <GridItem>
        <Typography color="textSecondary">or</Typography>
      </GridItem>
      <GridItem>
        <Button className={classes.button} {...props}>
          + Add files
        </Button>
      </GridItem>
    </GridColumn>
  )
}

export default DropZone
