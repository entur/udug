import React from 'react';
import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0,
} from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import { App } from './App';

const onRedirectCallback =
  (navigate: any) =>
  (appState: any): void => {
    navigate(appState?.returnTo || window.location.pathname);
  };

export interface Props extends Auth0ProviderOptions {}

const AuthedApp = () => {
  const auth = useAuth0();

  return <App locale={process.env.REACT_APP_LOCALE || 'en'} env={process.env.REACT_APP_ENV || 'dev'} getToken={auth.getAccessTokenSilently} />;
};

export const AppShellStandalone = (props: Props) => {
  const history = useHistory();
  return (
    <Auth0Provider
      {...props}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={onRedirectCallback((v: string) => history.push(v))}
    >
      <AuthedApp />
    </Auth0Provider>
  );
};
