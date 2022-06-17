import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { registerMicroFrontend, DefaultPayload } from '@entur/micro-frontend';
import { AppShellStandalone } from './AppShellStandalone';

registerMicroFrontend<DefaultPayload>({
  microFrontendId: 'ror-udug',
  mount: (mountPoint, payload) => {
    const root = createRoot(mountPoint as Element);
    root.render(<App {...payload} />);
  },
  unmount: (mountPoint) => {
    const root = createRoot(mountPoint as Element);
    root.unmount();
  },
});

if (process.env.REACT_APP_STANDALONE) {
  const root = createRoot(document.getElementById('root') as Element);
  root.render(
    <AppShellStandalone
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
      redirectUri={`${window.location.origin}${process.env.REACT_APP_AUTH0_RELATIVE_CALLBACK_URL}`}
    />
  );
}
