import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { MarketListingTypes } from 'models/Market';
import React, { FC } from 'react';



export interface MarketFilterProps {
  className?: string;
  listingType: MarketListingTypes;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filter: {
      background: '#ffffff',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      maxWidth: '20%',
      flex: '1 1 auto',
    }
  })
)



const MarketFilter: FC<MarketFilterProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.filter}>
      {children}
    </div>
  );
};

export default MarketFilter;