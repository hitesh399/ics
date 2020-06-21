import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AuthLayout } from '../shared/layout/AuthLayout';
import { LoginPage } from '../views/auth/Login';
import { SignupPage } from '../views/auth/Signup';

const NoMatch = () => <p>404</p>;

export function AuthRoutes({ match }) {
    return (
        <AuthLayout>
            <Switch>
                <Route path={match.path} exact component={LoginPage} />
                <Route path={`${match.path}/signup`} exact component={SignupPage} />
                <Route component={NoMatch} />
            </Switch>
        </AuthLayout>
    );
}
