import {
  Button, Grid, makeStyles,
} from '@material-ui/core'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import React, { FC } from 'react'

const useButtonStyle = makeStyles(() => ({
  root: {
    minWidth: '1em',
    border: 'none',
  },
  label: {
    height: '1em',
  },
}))

export type RifPagingProps = {
  from: number
  to: number
  total: number
  onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onPrev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const RifPaging: FC<RifPagingProps> = ({
  from, to, total, onNext, onPrev,
}) => {
  const buttonStyleClasses = useButtonStyle()
  return (
    <Grid
      container
      direction="row"
      spacing={1}
    >
      <Grid item xs>
        <Button
          variant="text"
          color="primary"
          onClick={onPrev}
          size="small"
          classes={buttonStyleClasses}
        >
          <NavigateBefore />

        </Button>
      </Grid>
      <Grid item xs={6}>
        { `${from}-${to}/${total}`}
      </Grid>
      <Grid item xs>
        <Button
          variant="text"
          color="primary"
          onClick={onNext}
          size="small"
          classes={buttonStyleClasses}
        >
          <NavigateNext />

        </Button>
      </Grid>
    </Grid>
  )
}
export default RifPaging
