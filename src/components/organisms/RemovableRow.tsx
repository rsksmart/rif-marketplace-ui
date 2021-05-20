import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { colors } from '@rsksmart/rif-ui'
import RemoveButton from 'components/atoms/RemoveButton'
import { SelectRowButtonProps } from 'components/molecules/SelectRowButton'

const useStyles = makeStyles((theme: Theme) => ({
  innerContainer: {
    backgroundColor: colors.transparent,
    borderRadius: 10,
    padding: theme.spacing(2),
    border: `1px solid ${colors.gray3}`,
    height: '25%',
  },
  removeButton: {
    maxWidth: '20px',
    maxHeight: '20px',
    minWidth: '20px',
    minHeight: '20px',
  },
}))

const RemovableRow: FC<SelectRowButtonProps> = ({
  className = '', children, id, handleSelect,
}) => {
  const classes = useStyles()
  return (
    <Grid className={className} container alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Grid
          container
          alignItems="center"
          className={classes.innerContainer}
          spacing={1}
        >
          {children}
          <Grid xs={3} item>
            <RemoveButton
              className={classes.removeButton}
              id={id}
              handleSelect={handleSelect}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RemovableRow
