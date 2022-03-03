import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MicroFrontendPayload } from '@entur-partner/micro-frontend';
import { ErrorBoundary, Box } from '@entur-partner/common';
import { AppProvider } from './AppProvider';
import './App.css';
import { Report } from './pages/Report';

interface AppProps extends MicroFrontendPayload {}

export function App(props: AppProps) {
  return (
    <React.StrictMode>
      <ErrorBoundary
        fallback={
          <Box>
            {/* <ErrorMessage /> */}
            <pre>Error</pre>
          </Box>
        }
      >
        <AppProvider {...props}>
          <BrowserRouter
            basename={
              process.env.REACT_APP_STANDALONE ? '' : 'netex-validation-reports'
            }
          >
            <div className="app">
              <div className="app-content">
                <Switch>
                  <Route path="/report/:codespace/:id" component={Report} />
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
