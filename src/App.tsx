import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import './App.css';
import { Report } from './pages/Report';
import { DefaultPayload } from '@entur/micro-frontend';
import { ConfigContext, useConfigProviderValue } from './config/config';
import { IntlProvider } from 'react-intl';
import { useLocaleData } from './hooks/useLocaleData';

interface AppProps extends DefaultPayload {}

export function App(props: AppProps) {
  const { config, loading } = useConfigProviderValue(props.env!);
  const localeData = useLocaleData(props.locale!);

  return (
    <React.StrictMode>
      {!loading && (
        <ConfigContext.Provider value={config}>
          <IntlProvider
            messages={localeData}
            locale={props.locale!}
            defaultLocale="en"
          >
            <AppProvider {...props}>
              <BrowserRouter
                basename={
                  process.env.REACT_APP_STANDALONE
                    ? ''
                    : 'netex-validation-reports'
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
          </IntlProvider>
        </ConfigContext.Provider>
      )}
    </React.StrictMode>
  );
}
