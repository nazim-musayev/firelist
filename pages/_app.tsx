import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import theme from 'src/theme';
import Layout from 'components/Layout';
import 'styles/globals.css';
import { AppProps } from 'next/app';
import { DialogProvider } from 'context/Dialog';
import { SearchProvider } from 'context/Search';
import { AuthProvider } from 'context/Auth'; 
import { SnackBarProvider } from 'context/SnackBar';

export default function MyApp({ Component, pageProps } : AppProps) {

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Paper square>
          <AuthProvider>
            <DialogProvider>
              <SearchProvider>
                <SnackBarProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackBarProvider>
              </SearchProvider>
            </DialogProvider>
          </AuthProvider>
        </Paper>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};
