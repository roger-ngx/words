import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

import store from 'stores/store';
import { Provider } from 'react-redux';
import PageWithDrawer from 'components/PageWithDrawer';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

//https://github.com/mui-org/material-ui/issues/15073
// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const [ currentUser, setCurrentUser ] = useState();

  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const currentUser = localStorage.getItem('currentUser');
    if(isEmpty(currentUser)){
      router.push('/');
    }

    setCurrentUser(currentUser);

  }, []);

  return (
    <Provider store={store}>
      <React.Fragment>
        <Head>
          <title>Words</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <div style={{display: 'flex', flexDirection: 'row'}}>
            { !!currentUser && <PageWithDrawer /> }
            <div style={{flex: 1}}>
              <Component {...pageProps} />
            </div>
          </div>
        </ThemeProvider>
      </React.Fragment>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
