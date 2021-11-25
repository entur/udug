import React from 'react'

import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react'

import {Report} from './pages/Report'

import './App.css'

export const history = createBrowserHistory()

const ProtectedRoute = ({ component, ...args }: any) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
)

const onRedirectCallback = (appState: any): void => {
    history.replace(appState?.returnTo || window.location.pathname)
}

function App() {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
            redirectUri={window.location.origin + process.env.REACT_APP_AUTH0_RELATIVE_CALLBACK_URL || ''}
            cacheLocation="localstorage"
            useRefreshTokens
            onRedirectCallback={onRedirectCallback}
        >
            <Router history={history}>
                <div className="app">
                    <div className="app-content">
                        <Switch>
                            <ProtectedRoute
                                path="/report/:codespace/:id"
                                component={Report}
                            />
                        </Switch>
                    </div>
                </div>
            </Router>
        </Auth0Provider>
    )
}

export default App
