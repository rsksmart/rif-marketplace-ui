import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import Routes from 'components/Routes';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Web3Provider from 'rifui/providers/Web3Provider';
import { MarketStoreProvider } from 'store/Market/MarketStore';
import { AppStoreProvider } from 'store/App/AppStore';

const App = () => {
  return (
    <AppStoreProvider>
      <MarketStoreProvider>
        <Web3Provider.Provider>
          <Router>
            <div
              data-testid="wrapper"
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Header />

              {/* Content of the dapp*/}
              {/* <div style={{ paddingTop: '1em' }}> */}
              <Routes />
              {/* </div> */}
              {/* <div style={{ flexGrow: 1 }} /> */}
              <Footer />
            </div>
          </Router>
        </Web3Provider.Provider>
      </MarketStoreProvider>
    </AppStoreProvider>
  );
};

export default App;
