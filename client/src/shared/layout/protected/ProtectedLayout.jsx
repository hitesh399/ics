import React from 'react';
import { ProtectedLayoutHeader } from './ProtectedLayoutHeader';
import { ProtectedLayoutSidebar } from './ProtectedLayoutSidebar';
import { ProtectedLayoutFooter } from './ProtectedLayoutFooter';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { changeSidebarStatus } from '../../../actions/sidebar-action';
import { DeviceScreenContext } from '../../DeviceScreenProvider';
import Hammer from 'react-hammerjs';
import { getCookie, setCookie, deleteCookie } from '../../../utils/app-utils';
import { updateAuthUserData, clearAuthData } from '../../../actions/auth-action';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ProtectedLayoutContext } from './ProtectedLayoutContext';
import { ProtectedLayoutCustomizer } from './ProtectedLayoutCustomizer';
import { request } from '../../../utils/axios-utils';

const mobileWidthAt = parseInt(process.env.REACT_APP_SIDEBAR_CONSIDER_MOBILE_AT_WIDTH);

export class ProtectedLayoutComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= mobileWidthAt,
            appThemeLayout: getCookie('APP_THEME_LAYOUT') || 'semi-dark-layout',
            appMenuColor: getCookie('APP_MENU_COLOR') || '',
            appNavColor: getCookie('APP_NAV_COLOR') || '',
            appNavStyle: getCookie('APP_NAV_STYLE') || 'navbar-sticky',
            appFooterStyle: getCookie('APP_FOOTER_STYLE') || 'footer-static',
            showCustomizer: false,
        };
    }
    setThemeLayout(layout) {
        document.body.classList.remove(this.state.appThemeLayout);
        document.body.classList.add(layout);
        setCookie('APP_THEME_LAYOUT', layout);
        this.setState({ appThemeLayout: layout });
    }
    setNavStyle(style) {
        document.body.classList.remove(this.state.appNavStyle);
        document.body.classList.add(style);
        setCookie('APP_NAV_STYLE', style);
        this.setState({ appNavStyle: style });
    }
    setFooterStyle(style) {
        document.body.classList.remove(this.state.appFooterStyle);
        document.body.classList.add(style);
        setCookie('APP_FOOTER_STYLE', style);
        this.setState({ appFooterStyle: style });
    }
    setNavColor(color) {
        this.setState({ appNavColor: color });
        setCookie('APP_NAV_COLOR', color);
    }
    setMenuColor(color) {
        setCookie('APP_MENU_COLOR', color);
        this.setState({ appMenuColor: color });
    }
    componentDidMount() {
        const { appThemeLayout, appNavStyle, appFooterStyle } = this.state;
        document.body.className = `vertical-layout ${appThemeLayout}  2-columns ${appNavStyle} ${appFooterStyle} vertical-menu-modern  menu-expanded pace-done`;
        this.handleResize();
        this.verifyAuthUser();

        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    verifyAuthUser() {
        /**
         * Check Authenticated User Profile.
         */
        const { userId, checkedAuth, history, dispatch } = this.props;
        const token = getCookie('ACCESS-TOKEN');

        if (!token) {
            dispatch(clearAuthData());
            history.push('/');
            return;
        }
        if (checkedAuth && !(userId && this.isValidRole())) {
            // User Is not authenticated and not a Admin User.
            dispatch(clearAuthData());
            history.push('/');
            return;
        }
        if (token && !userId) {
            // Hit api to get the User Profile,
            request('profile')
                .then(
                    ({
                        data: {
                            data: { user },
                        },
                    }) => {
                        dispatch(updateAuthUserData(user));
                    },
                )
                .catch(() => {
                    deleteCookie('ACCESS-TOKEN');
                    dispatch(clearAuthData());
                    history.push('/');
                });
        }
    }

    isValidRole() {
        return true;
        // const { authRole, onlyRoles } = this.props;
        // return authRole === onlyRoles;
    }

    handleScroll(e) {
        if (window.scrollY > 3) {
            document.body.classList.add('page-scrolled');
        } else {
            document.body.classList.remove('page-scrolled');
        }
    }
    handleResize() {
        const { sidebarStatus } = this.props;
        const isMobile = window.innerWidth <= mobileWidthAt;

        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile,
        });

        this.adjustBodyClassesBasedOnSidebarStatus(isMobile, sidebarStatus);
    }
    adjustBodyClassesBasedOnSidebarStatus(isMobile, sidebarStatus) {
        if (!isMobile) {
            document.body.classList.remove('menu-open');
            document.body.classList.remove('menu-close');
            if (!document.body.classList.contains('vertical-menu-modern')) {
                document.body.classList.add('vertical-menu-modern');
            }
            if (document.body.classList.contains('vertical-overlay-menu')) {
                document.body.classList.remove('vertical-overlay-menu');
            }
            if (document.body.classList.contains('mobile-sidebar')) {
                document.body.classList.remove('mobile-sidebar');
            }
            if (sidebarStatus === 'open') {
                document.body.classList.add('menu-expanded');
                document.body.classList.remove('menu-collapsed');
            } else if (sidebarStatus === 'mini') {
                document.body.classList.remove('menu-expanded');
                document.body.classList.add('menu-collapsed');
            } else {
                document.body.classList.remove('menu-expanded');
                document.body.classList.remove('menu-collapsed');
                document.body.classList.add('menu-close');
            }
        } else {
            document.body.classList.remove('menu-expanded');
            document.body.classList.remove('menu-collapsed');
            document.body.classList.remove('vertical-menu-modern');
            if (!document.body.classList.contains('mobile-sidebar')) {
                document.body.classList.add('mobile-sidebar');
            }
            if (!document.body.classList.contains('vertical-overlay-menu')) {
                document.body.classList.add('vertical-overlay-menu');
            }
            if (sidebarStatus === 'open') {
                document.body.classList.add('menu-open');
                document.body.classList.remove('menu-close');
            } else {
                document.body.classList.remove('menu-open');
                document.body.classList.add('menu-close');
            }
        }
    }
    getSnapshotBeforeUpdate(prevProps) {
        if (this.props.sidebarStatus !== prevProps.sidebarStatus) {
            return 'change_in_sidebar_visibility';
        }
        return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot === 'change_in_sidebar_visibility') {
            const { sidebarStatus } = this.props;
            const { isMobile } = this.state;
            this.adjustBodyClassesBasedOnSidebarStatus(isMobile, sidebarStatus);
        }
        this.verifyAuthUser();
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    hanldeDragRight = (e) => {
        e.preventDefault();
        if (this.state.isMobile && this.props.sidebarStatus === 'close') {
            this.props.dispatch(changeSidebarStatus('open'));
        }
    };
    toggleCustomizer = () => {
        this.setState({ showCustomizer: !this.state.showCustomizer });
    };

    render() {
        const { children, dispatch, menuItems, checkedAuth } = this.props;
        const {
            width,
            height,
            isMobile,
            appMenuColor,
            appThemeLayout,
            showCustomizer,
            appNavColor,
            appNavStyle,
            appFooterStyle,
        } = this.state;
        /**
         * Wiat util the profile does not verify.
         */
        if (!checkedAuth) return 'Wait...';

        return (
            <ProtectedLayoutContext.Provider
                value={{
                    setFooterStyle: this.setFooterStyle.bind(this),
                    setNavStyle: this.setNavStyle.bind(this),
                    setNavColor: this.setNavColor.bind(this),
                    setMenuColor: this.setMenuColor.bind(this),
                    setThemeLayout: this.setThemeLayout.bind(this),
                    toggleCustomizer: this.toggleCustomizer,

                    appFooterStyle,
                    appMenuColor,
                    appNavColor,
                    appThemeLayout,
                    appNavStyle,
                }}>
                <DeviceScreenContext.Provider value={{ width, height, isMobile }}>
                    <ProtectedLayoutHeader
                        username={this.props.username}
                        appNavColor={appNavColor}
                        appNavStyle={appNavStyle}
                    />
                    <ProtectedLayoutSidebar
                        menuItems={menuItems}
                        appMenuColor={appMenuColor}
                        appThemeLayout={appThemeLayout}
                    />
                    <div className="app-content content">
                        <div className="content-overlay"></div>
                        <div className="content-wrapper">{children}</div>
                    </div>
                    <div
                        className="sidenav-overlay"
                        onClick={() => dispatch(changeSidebarStatus('close'))}></div>
                    {isMobile ? (
                        <Hammer onPanStart={this.hanldeDragRight} direction="DIRECTION_RIGHT">
                            <div className="drag-target"></div>
                        </Hammer>
                    ) : null}
                    <ProtectedLayoutFooter />
                    <div className={`customizer ${showCustomizer ? 'open' : ''}`}>
                        <ProtectedLayoutCustomizer />
                    </div>
                </DeviceScreenContext.Provider>
            </ProtectedLayoutContext.Provider>
        );
    }
}

ProtectedLayoutComponent.propTypes = {
    onlyRoles: PropTypes.string.isRequired,
    menuItems: PropTypes.array.isRequired,
};

export const ProtectedLayout = connect(function (state) {
    return {
        sidebarStatus: get(state, 'sidebar.status', 'close'),
        userId: get(state, 'auth.user.id', null),
        username: get(state, 'auth.user.username', null),
        authRole: get(state, 'auth.user.role', null),
        checkedAuth: get(state, 'auth.checked', false),
    };
})(withRouter(ProtectedLayoutComponent));
