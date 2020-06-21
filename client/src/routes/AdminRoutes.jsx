import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ProtectedLayout } from '../shared/layout/protected/ProtectedLayout';
import { AdminMenuItems } from '../menu/AdminMenuItems';
import { AdminPostPage } from '../views/admin/Post';

const NoMatch = () => <p>404</p>;

export function AdminRoutes({ match }) {
    return (
        <ProtectedLayout menuItems={AdminMenuItems} onlyRoles="admin">
            <Switch>
                <Route path={match.path} exact component={AdminPostPage} />
                <Route component={NoMatch} />
            </Switch>
        </ProtectedLayout>
    );
}
