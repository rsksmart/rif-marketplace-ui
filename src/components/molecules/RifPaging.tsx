import { Button, Grid, makeStyles } from '@material-ui/core'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import React from 'react'

const useButtonStyle = makeStyles(() => ({
  root: {
    minWidth: '1em',
    // borderRadius: '50px',
    border: 'none',
  },
  label: {
    height: '1em',
  },
}))

const RifPaging = ({
  from, to, total, onNext, onPrev,
}) => {
  const buttonStyleClasses = useButtonStyle()
  return (
    <Grid
      container
      direction="row"
      spacing={0}
      wrap="nowrap"
    >
      <Grid item>
        <Button
          variant="text"
          color="primary"
        //   startIcon={}
          onClick={onPrev}
          size="small"
          classes={buttonStyleClasses}
        >
          <NavigateBefore />

        </Button>
      </Grid>
      <Grid item>
        { `${from}-${to}/${total}`}
      </Grid>
      <Grid item>
        <Button
          variant="text"
          color="primary"
        //   endIcon={<NavigateNext />}
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
