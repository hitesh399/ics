import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import { changeSidebarStatus } from '../../../actions/sidebar-action';
import classNames from 'classnames';
import { DeviceScreenContext } from '../../DeviceScreenProvider';
import LogoImage from '../../../assets/images/icon/google.png';
import { Link } from 'react-router-dom';
import { SidebarMenu } from './SidebarMenu';

export const ProtectedLayoutSidebar = ({ menuItems, appThemeLayout, appMenuColor }) => {
    const sidebarStatus = useSelector((state) => get(state, 'sidebar.status', 'close'));

    const dispatch = useDispatch();
    const [expand, setexpand] = useState(false);

    const deviceScreen = useContext(DeviceScreenContext);

    const changeMenuStatus = (closeStatusName = 'mini') => {
        if (sidebarStatus === 'open') {
            dispatch(changeSidebarStatus(closeStatusName));
        } else {
            dispatch(changeSidebarStatus('open'));
        }
    };
    const handleMouseOver = () => {
        if (expand === false) {
            setexpand(true);
        }
    };
    const handleMouseLeave = () => {
        if (expand === true) {
            setexpand(false);
        }
    };
    return (
        <div
            className={classNames({
                'main-menu menu-fixed menu-accordion menu-shadow': true,
                expanded: expand || sidebarStatus === 'open',
                'menu-light': appThemeLayout === 'light-layout',
                'menu-dark': appThemeLayout !== 'light-layout',
                ['active-' + appMenuColor]: !!appMenuColor,
            })}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}>
            <div
                className={classNames({
                    'navbar-header': true,
                    expanded: expand || (sidebarStatus === 'open' && deviceScreen.isMobile),
                })}>
                <ul className="nav navbar-nav flex-row">
                    <li className="nav-item mr-auto">
                        <Link className="navbar-brand" to="/admin">
                            <div className="brand-logo">
                                <img className="logo" src={LogoImage} alt="React Starter Package" />
                            </div>
                            <h2 className="brand-text mb-0" title="React Starter Package">
                                DC
                            </h2>
                        </Link>
                    </li>
                    <li className="nav-item nav-toggle">
                        <button type="button" className="link nav-link modern-nav-toggle pr-0">
                            {!deviceScreen.isMobile ? (
                                <i
                                    onClick={() => changeMenuStatus()}
                                    className={classNames({
                                        'bx  font-medium-4 primary': true,
                                        'bx-disc': sidebarStatus === 'open',
                                        'bx-circle': sidebarStatus !== 'open',
                                    })}></i>
                            ) : (
                                <i
                                    onClick={() => changeMenuStatus('close')}
                                    className="bx bx-x d-block font-medium-4 primary"></i>
                            )}
                        </button>
                    </li>
                </ul>
            </div>
            <div className="shadow-bottom"></div>
            <div className="main-menu-content">
                <SidebarMenu menuItems={menuItems} />
            </div>
        </div>
    );
};
