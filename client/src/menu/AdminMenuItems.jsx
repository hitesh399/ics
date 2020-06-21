import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { deleteCookie } from '../utils/app-utils';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '../actions/auth-action';
import { ProtectedLayoutContext } from '../shared/layout/protected/ProtectedLayoutContext';
/**
 * Log out Menu
 */
const LogoutMenu = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = (e) => {
        e.preventDefault();
        deleteCookie('ACCESS-TOKEN');
        dispatch(clearAuthData());
        history.push('/');
    };
    return (
        <button className="link" onClick={logout}>
            <i className="fas fa-lock"></i>
            <span className="menu-title" title="Logout">
                Logout
            </span>
        </button>
    );
};
const ThemeCustomizerMenu = () => {
    const { toggleCustomizer } = useContext(ProtectedLayoutContext);
    return (
        <button className="link" onClick={toggleCustomizer}>
            <i className="fas fa-life-ring"></i>
            <span className="menu-title" title="Logout">
                Theme Customizer
            </span>
        </button>
    );
};

export const AdminMenuItems = [
    {
        to: '/admin',
        title: 'Dashboard',
        icon: 'fas fa-desktop',
    },

    {
        title: 'Theme Customizer',
        icon: 'fas fa-lock',
        itemComponent: ThemeCustomizerMenu,
    },
    {
        title: 'Logout',
        icon: 'fas fa-lock',
        itemComponent: LogoutMenu,
    },
];
