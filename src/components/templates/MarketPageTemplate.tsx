import React, { FC, useContext } from 'react';
import MarketFilter from 'components/templates/marketplace/MarketFilter';
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace';
import { MarketItemType, MarketListingTypes } from 'models/Market';
import { Grid } from 'rifui';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Web3Store } from 'rifui/providers/Web3Provider';



export interface MarketPageTemplateProps {
  className: string;
  filterItems: React.ReactNode;
  headers: TableHeaders;
  itemCollection: MarketItemType[];
  listingType: MarketListingTypes;
}

const useStyles = makeStyles((them: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  }
}));

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filterItems,
  itemCollection,
  headers,
}) => {
  const {
    state: { account },
  } = useContext(Web3Store);
  const classes = useStyles();

  return (
    <Grid container direction='row' className={`${classes.root} ${className}`}>
      {!account && <p>Please sign in to your wallet</p>}
      {account &&
        <>
          <Grid item sm={12} md={3}>
            <MarketFilter>{filterItems}</MarketFilter>
          </Grid>
          <Grid item sm={12} md={9}>
            <Marketplace items={itemCollection} headers={headers} />
          </Grid>
        </>
      }
    </Grid>
  );
};

export default MarketPageTemplate;
