import React from 'react'

import { Routes, Route, useNavigate } from 'react-router-dom'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react'

import { Report } from './pages/Report'

import './App.css'

const AuthenticatedReport = withAuthenticationRequired(Report);

const onRedirectCallback = (navigate: any) => (appState: any): void => {
    navigate(appState?.returnTo || window.location.pathname);
}

function App() {
    const navigate = useNavigate();
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
            redirectUri={`${window.location.origin}${process.env.REACT_APP_AUTH0_RELATIVE_CALLBACK_URL}`}
            cacheLocation="localstorage"
            useRefreshTokens
            onRedirectCallback={onRedirectCallback(navigate)}
        >
                <div className="app">
                    <div className="app-content">
                        <Routes>
                            <Route
                                path="/report/:codespace/:id"
                                element={<AuthenticatedReport />}
                            />
                        </Routes>
                    </div>
                </div>
        </Auth0Provider>
    )
}

export default App
