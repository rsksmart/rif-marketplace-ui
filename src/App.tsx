import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { theme, Web3Provider } from '@rsksmart/rif-ui';
import { AppStoreProvider } from 'store/App/AppStore';
import { MarketStoreProvider } from 'store/Market/MarketStore';
import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import Routes from 'components/Routes';
import '@rsksmart/rif-ui/dist/index.css';
import PageTemplate from 'components/templates/PageTemplate';

const useStyles = makeStyles(() => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }
}));

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppStoreProvider>
        <MarketStoreProvider>
          <Web3Provider.Provider>
            <Router>
              <Header />
              <PageTemplate>
                <Routes />
              </PageTemplate>
              <Footer />
            </Router>
          </Web3Provider.Provider>
        </MarketStoreProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
};

export default App;
