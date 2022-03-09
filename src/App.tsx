import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { MicroFrontendPayload } from '@entur-partner/micro-frontend';
// import { ErrorBoundary, Box } from '@entur-partner/common';
import { AppProvider } from './AppProvider';
import './App.css';
import { Report } from './pages/Report';
import {DefaultPayload} from '@entur/micro-frontend';

interface AppProps extends DefaultPayload {}

export function App(props: AppProps) {
  return (
    <React.StrictMode>
      
        <AppProvider {...props}>
          <BrowserRouter
            basename={
              process.env.REACT_APP_STANDALONE ? '' : 'netex-validation-reports'
            }
          >
            <div className="udug-app">
              <div className="udug-app-content">
                <Switch>
                  <Route path="/report/:codespace/:id" component={Report} />
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        </AppProvider>
    </React.StrictMode>
  );
}
