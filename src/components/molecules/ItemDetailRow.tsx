import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Typography } from 'rifui';
import { fonts } from 'rifui/theme';

export interface ItemDetailRowProps {
  name: string
  value: string | React.ElementType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    details_row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing(0.5)
    },
    nameTypography: {
      fontSize: fonts.size.small
    }
  }),
);


const ItemDetailRow: FC<ItemDetailRowProps> = ({ name, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.details_row}>
      <Typography className={classes.nameTypography}>{name}</Typography>
      <div>{value}</div>
    </div>
  )
}

export default ItemDetailRow;