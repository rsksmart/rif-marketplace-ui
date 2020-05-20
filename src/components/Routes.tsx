import NotFound from 'components/pages/NotFound';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ROUTES } from 'routes';
import Logger from 'utils/Logger';
import LandingPage from './pages/LandingPage';
import { FAQPage } from './pages/faq';
import { StoragePage } from './pages/storage';
import AboutPage from './pages/AboutPage';
import {
  DomainsCheckoutPage,
  MyDomainsPage,
  DomainOffersPage,
  DomainPurchased,
  DomainOffersCheckoutPage,
  DomainListed,
  CancelDomainCheckoutPage,
  DomainCanceled,
  SoldDomainsPage
} from './pages/rns';


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
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.STORAGE} component={StoragePage} />
      <Route exact path={ROUTES.FAQ} component={FAQPage} />
      <Route exact path={ROUTES.DOMAINS.BUY} component={DomainOffersPage} />
      <Route exact path={ROUTES.DOMAINS.SOLD} component={SoldDomainsPage} />
      <Route exact path={ROUTES.DOMAINS.CHECKOUT.BUY} component={DomainOffersCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.SELL} component={MyDomainsPage} />
      <Route exact path={ROUTES.DOMAINS.CHECKOUT.SELL} component={DomainsCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.CHECKOUT.CANCEL} component={CancelDomainCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.DONE.SELL} component={DomainListed} />
      <Route exact path={ROUTES.DOMAINS.DONE.BUY} component={DomainPurchased} />
      <Route exact path={ROUTES.DOMAINS.DONE.CANCEL} component={DomainCanceled} />
      <Route exact path={ROUTES.ABOUT} component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
