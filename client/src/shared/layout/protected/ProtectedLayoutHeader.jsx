import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSidebarStatus } from '../../../actions/sidebar-action';
import AvatarImage from '../../../assets/images/portrait/small/avatar-s-16.jpg';
import { get } from 'lodash';
import classNames from 'classnames';

export const ProtectedLayoutHeader = ({ appNavColor, appNavStyle, username }) => {
    const dispatch = useDispatch();
    const sidebarStatus = useSelector((state) => get(state, 'sidebar.status', 'close'));

    const toggleSidebarStatus = () => {
        dispatch(changeSidebarStatus(sidebarStatus !== 'close' ? 'close' : 'open'));
    };
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    //navbar-static-top
    return (
        <>
            <div className="header-navbar-shadow"></div>
            <nav
                className={classNames({
                    'header-navbar main-header-navbar navbar-expand-lg navbar navbar-with-menu': true,
                    'fixed-top': appNavStyle === 'navbar-sticky',
                    'navbar-static-top': appNavStyle === 'navbar-static',
                    'd-none': appNavStyle === 'navbar-hidden',
                    [appNavColor]: appNavColor,
                })}>
                <div className="navbar-wrapper">
                    <div className="navbar-container content">
                        <div className="navbar-collapse" id="navbar-mobile">
                            <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
                                <ul className="nav navbar-nav">
                                    <li className="nav-item mobile-menu  mr-auto">
                                        <button
                                            type="button"
                                            onClick={toggleSidebarStatus}
                                            className="link nav-link nav-menu-main menu-toggle">
                                            <i className="ficon bx bx-menu"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <ul className="nav navbar-nav float-right align-items-center">
                                <li className="nav-item d-none d-lg-block">
                                    <button
                                        type="button"
                                        onClick={toggleFullScreen}
                                        className="link nav-link nav-link-expand">
                                        <i
                                            className={`ficon bx bx-${
                                                document.fullscreenElement ? 'exit-' : ''
                                            }fullscreen`}></i>
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="link dropdown-toggle nav-link dropdown-user-link"
                                        data-toggle="dropdown">
                                        <div className="user-nav d-sm-flex d-none">
                                            <span className="user-name">{username}</span>
                                            <span className="user-status text-muted">
                                                Available
                                            </span>
                                        </div>
                                        <span>
                                            <img
                                                className="round"
                                                src={AvatarImage}
                                                alt="avatar"
                                                height="40"
                                                width="40"
                                            />
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
