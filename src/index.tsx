import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { registerMicroFrontend } from '@entur-partner/micro-frontend';
import { AppShellStandalone } from '@entur-partner/app-shell-standalone';

registerMicroFrontend({
  microFrontendId: 'ror-udug',
  mount: (mountPoint, payload) => {
    ReactDOM.render(<App {...payload} />, mountPoint);
  },
  unmount: (mountPoint) => {
    ReactDOM.unmountComponentAtNode(mountPoint);
  },
});

if (process.env.REACT_APP_STANDALONE) {
  ReactDOM.render(
    <AppShellStandalone
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
      getOrganisations={async () => []}
      decorateUser={async (user, token) => ({
        ...user,
        'https://entur.io/organisationID': 1,
        permissions: [],
        enturPartnerPermissions: [],
      })}
      redirectUri={`${window.location.origin}${process.env.REACT_APP_AUTH0_RELATIVE_CALLBACK_URL}`}
    >
      {(values) => {
        return <App {...values} />;
      }}
    </AppShellStandalone>,
    document.getElementById('root'),
  );
}
