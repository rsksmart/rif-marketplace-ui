import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from 'components/organisms/Header';
import Routes from 'components/Routes';
import { AppStoreProvider } from 'store/App/AppStore';
import Logger from 'utils/Logger';
const logger = Logger.getInstance();

logger.info('App -> RNS_SERVER:', process.env.REACT_APP_RNS_SERVER);

const App = () => {
  return (
    <AppStoreProvider>
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
          <div style={{ paddingTop: '1em' }}>
            <Routes />
          </div>
          <div style={{ flexGrow: 1 }} />
        </div>
      </Router>
    </AppStoreProvider>
  );
};

export default App;
