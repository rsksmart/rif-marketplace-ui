import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Web3Provider from 'rifui/providers/Web3Provider';

import Header from 'components/organisms/Header';
import Routes from 'components/Routes';
import Logger from 'utils/Logger';
import { UserStoreProvider } from 'store/User/UserStore';
const logger = Logger.getInstance();

logger.info('App -> RNS_SERVER:', process.env.REACT_APP_RNS_SERVER);

const App = () => {
  return (
    <UserStoreProvider>
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
          </div>
        </Router>
      </Web3Provider.Provider>
    </UserStoreProvider>
  );
};

export default App;
