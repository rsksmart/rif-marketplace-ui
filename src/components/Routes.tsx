import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

// views
import NotFound from 'components/pages/NotFound';
import { ROUTES } from 'routes';
import Logger from 'utils/Logger';
import { LandingPage } from './pages/LandingPage';
import DomainsBuyPage from './pages/rns/DomainsBuyPage';
import DomainOffersCheckoutPage from './pages/rns/DomainOffersCheckoutPage';
import TxCompletePageTemplate from './templates/TxCompletePageTemplate';
import { DomainsSellPage, DomainsCheckoutPage } from './pages/rns';
import DomainPurchased from './pages/rns/DomainPurchased';
import DomainListed from './pages/rns/DomainListed';

const logger = Logger.getInstance();

const Routes = () => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('Routes -> location', location);
      logger.debug('Routes -> action', action);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <Switch>
      <Route exact={true} path={ROUTES.LANDING} component={LandingPage} />
      <Route exact={true} path={ROUTES.DOMAINS.BUY} component={DomainsBuyPage} />
      <Route exact={true} path={ROUTES.DOMAINS.SELL} component={DomainsSellPage} />
      <Route exact={true} path={ROUTES.CHECKOUT.DOMAIN_OFFERS} component={DomainOffersCheckoutPage} />
      <Route exact={true} path={ROUTES.CHECKOUT.DOMAINS} component={DomainsCheckoutPage} />
      <Route exact={true} path={ROUTES.DONE.DOMAINS} component={DomainListed} />
      <Route exact={true} path={ROUTES.DONE.DOMAIN_OFFERS} component={DomainPurchased} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
