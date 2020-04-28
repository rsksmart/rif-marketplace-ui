import React, { FC, useContext } from 'react';
import MarketFilter from 'components/templates/marketplace/MarketFilter';
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace';
import { MarketItemType } from 'models/Market';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@rsksmart/rif-ui';
import { Web3Store } from '@rsksmart/rif-ui';

export interface MarketPageTemplateProps {
  className: string;
  filterItems: React.ReactNode;
  headers: TableHeaders;
  itemCollection: MarketItemType[];
  accountRequired?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  resultsContainer: {
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3)
    }
  }
}));

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filterItems,
  itemCollection,
  headers,
  accountRequired,
}) => {
  const {
    state: { account },
  } = useContext(Web3Store);
  const classes = useStyles();

  return (
    <Grid container direction='row' className={`${classes.root} ${className}`}>
      {accountRequired && !account && <p>Please sign in to your wallet</p>}
      {(!accountRequired || account) &&
        <>
          <Grid item sm={12} md={3}>
            <MarketFilter>{filterItems}</MarketFilter>
          </Grid>
          <Grid className={classes.resultsContainer} item sm={12} md={9}>
            <Marketplace items={itemCollection} headers={headers} />
          </Grid>
        </>
      }
    </Grid >
  );
};

export default MarketPageTemplate;
