import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, fonts } from '@rsksmart/rif-ui';

export interface StoragePageProps { };

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StoragePage: FC<StoragePageProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography color='primary' variant='h1'>Storage empty page</Typography>
    </div>
  );
};

export default StoragePage;
