import React, { FC, useContext } from 'react';
import MarketFilter from 'components/templates/marketplace/MarketFilter';
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace';
import { MarketItemType } from 'models/Market';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Web3Store } from 'rifui/providers/Web3Provider';



export interface MarketPageTemplateProps {
  className: string;
  filterItems: React.ReactNode;
  itemCollection: MarketItemType[];
  headers: TableHeaders;
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
    <div className={`${classes.root} ${className}`}>
      {!account && <p>Please sign in to your wallet</p>}
      {account &&
        <>
          <MarketFilter>{filterItems}</MarketFilter>
          <Marketplace items={itemCollection} headers={headers} />
        </>
      }
    </div>
  );
};

export default MarketPageTemplate;
