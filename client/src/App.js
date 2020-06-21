import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { Router, Redirect } from 'react-router';
import { AuthRoutes } from './routes/AuthRoutes';
import { history } from './history';
import { AdminRoutes } from './routes/AdminRoutes';
import { AppModalProvider } from './shared/modal/AppModalProvider';
const NoMatch = () => <p>404</p>;

function App() {
    return (
        <Router history={history}>
            <Switch>
                <Redirect from="/" t to="/auth" exact></Redirect>
                <Route path="/auth" children={AuthRoutes}></Route>
                <Route path="/admin" children={AdminRoutes}></Route>
                <Route component={NoMatch} />
            </Switch>
            <AppModalProvider />
        </Router>
    );
}

export default App;
