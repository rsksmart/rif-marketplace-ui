import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppStoreProvider } from 'store/App/AppStore';
import { MarketStoreProvider } from 'store/Market/MarketStore';
import Web3Provider from 'rifui/providers/Web3Provider';
import { theme } from 'rifui/theme';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core/styles';
import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import Routes from 'components/Routes';

const useStyles = makeStyles((theme: Theme) => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <AppStoreProvider>
        <MarketStoreProvider>
          <Web3Provider.Provider>
            <Router>
              <div
                data-testid="wrapper"
                className={classes.router}
              >
                <Header />
                <Routes />
                <Footer />
              </div>
            </Router>
          </Web3Provider.Provider>
        </MarketStoreProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
};

export default App;
