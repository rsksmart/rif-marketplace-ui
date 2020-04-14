import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

// views
import NotFound from 'components/pages/NotFound';
import { ROUTES } from 'routes';
import Logger from 'utils/Logger';
import { LandingPage } from './pages/LandingPage';
import DomainsBuyPage from './pages/DomainsBuyPage';
import DomainsCheckoutPage from './pages/DomainsCheckoutPage';
import TransactionCompletePage from './pages/TransactionCompletePage';
import DomainsSellPage from './pages/DomainsSellPage';

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
      <Route exact={true} path={ROUTES.CHECKOUT.DOMAINS} component={DomainsCheckoutPage} />
      <Route exact={true} path={ROUTES.DONE} component={TransactionCompletePage} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
