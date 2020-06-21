import React, { useContext } from 'react';
import { ProtectedLayoutContext } from './ProtectedLayoutContext';
import classNames from 'classnames';

export const ProtectedLayoutCustomizer = () => {
    const {
        setThemeLayout,
        appThemeLayout,
        toggleCustomizer,
        setMenuColor,
        appMenuColor,
        appNavColor,
        setNavColor,
        appNavStyle,
        setNavStyle,
        appFooterStyle,
        setFooterStyle,
    } = useContext(ProtectedLayoutContext);
    return (
        <>
            <button onClick={toggleCustomizer} className="customizer-close link">
                <i className="bx bx-x"></i>
            </button>
            <div className="customizer-content p-4">
                <h4 className="text-uppercase mb-0">Theme Customizer</h4>
                <small>Customize & Preview in Real Time</small>
                <hr />

                <h5 className="mt-1">Theme Layout</h5>
                <div className="theme-layouts">
                    <div className="d-flex justify-content-start">
                        <div className="mx-50">
                            <fieldset>
                                <div className="radio">
                                    <input
                                        type="radio"
                                        name="layoutOptions"
                                        value="light-layout"
                                        id="radio-light"
                                        className="layout-name"
                                        onChange={(e) => setThemeLayout(e.target.value)}
                                        checked={appThemeLayout === 'light-layout'}
                                    />
                                    <label htmlFor="radio-light">Light</label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="mx-50">
                            <fieldset>
                                <div className="radio">
                                    <input
                                        type="radio"
                                        name="layoutOptions"
                                        value="dark-layout"
                                        id="radio-dark"
                                        className="layout-name"
                                        onChange={(e) => setThemeLayout(e.target.value)}
                                        checked={appThemeLayout === 'dark-layout'}
                                    />
                                    <label htmlFor="radio-dark">Dark</label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="mx-50">
                            <fieldset>
                                <div className="radio">
                                    <input
                                        type="radio"
                                        name="layoutOptions"
                                        value="semi-dark-layout"
                                        id="radio-semi-dark"
                                        className="layout-name"
                                        onChange={(e) => setThemeLayout(e.target.value)}
                                        checked={appThemeLayout === 'semi-dark-layout'}
                                    />
                                    <label htmlFor="radio-semi-dark">Semi Dark</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <hr />

                <div id="customizer-theme-colors">
                    <h5>Menu Colors</h5>
                    <ul className="list-inline unstyled-list">
                        <li
                            onClick={() => setMenuColor('')}
                            className={classNames({
                                'color-box bg-primary': true,
                                selected: !appMenuColor,
                            })}
                            data-color="theme-primary"></li>
                        <li
                            onClick={() => setMenuColor('bg-success')}
                            className={classNames({
                                'color-box bg-success': true,
                                selected: appMenuColor === 'bg-success',
                            })}
                            data-color="theme-success"></li>
                        <li
                            onClick={() => setMenuColor('bg-danger')}
                            className={classNames({
                                'color-box bg-danger': true,
                                selected: appMenuColor === 'bg-danger',
                            })}
                            data-color="theme-danger"></li>
                        <li
                            onClick={() => setMenuColor('bg-info')}
                            className={classNames({
                                'color-box bg-info': true,
                                selected: appMenuColor === 'bg-info',
                            })}
                            data-color="theme-info"></li>
                        <li
                            onClick={() => setMenuColor('bg-warning')}
                            className={classNames({
                                'color-box bg-warning': true,
                                selected: appMenuColor === 'bg-warning',
                            })}
                            data-color="theme-warning"></li>
                        <li
                            onClick={() => setMenuColor('bg-dark')}
                            className={classNames({
                                'color-box bg-dark': true,
                                selected: appMenuColor === 'bg-dark',
                            })}
                            data-color="theme-dark"></li>
                    </ul>
                    <hr />
                </div>

                <div id="customizer-navbar-colors">
                    <h5>Navbar Colors</h5>
                    <ul className="list-inline unstyled-list">
                        <li
                            onClick={() => setNavColor('')}
                            className={classNames({
                                'color-box bg-default': true,
                                selected: !appNavColor,
                            })}
                            data-color="theme-primary"></li>
                        <li
                            onClick={() => setNavColor('bg-primary')}
                            className={classNames({
                                'color-box bg-primary': true,
                                selected: appNavColor === 'bg-primary',
                            })}
                            data-color="theme-primary"></li>
                        <li
                            onClick={() => setNavColor('bg-success')}
                            className={classNames({
                                'color-box bg-success': true,
                                selected: appNavColor === 'bg-success',
                            })}
                            data-color="theme-success"></li>
                        <li
                            onClick={() => setNavColor('bg-danger')}
                            className={classNames({
                                'color-box bg-danger': true,
                                selected: appNavColor === 'bg-danger',
                            })}
                            data-color="theme-danger"></li>
                        <li
                            onClick={() => setNavColor('bg-info')}
                            className={classNames({
                                'color-box bg-info': true,
                                selected: appNavColor === 'bg-info',
                            })}
                            data-color="theme-info"></li>
                        <li
                            onClick={() => setNavColor('bg-warning')}
                            className={classNames({
                                'color-box bg-warning': true,
                                selected: appNavColor === 'bg-warning',
                            })}
                            data-color="theme-warning"></li>
                        <li
                            onClick={() => setNavColor('bg-dark')}
                            className={classNames({
                                'color-box bg-dark': true,
                                selected: appNavColor === 'bg-dark',
                            })}
                            data-color="theme-dark"></li>
                    </ul>
                    {/* <small>
                        <strong>Note :</strong> This option with work only on sticky navbar when you
                        scroll page.
                    </small> */}
                    <hr />
                </div>

                <h5>Navbar Type</h5>
                <div className="navbar-type d-flex justify-content-start">
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="navbarType"
                                    value="navbar-hidden"
                                    id="navbar-hidden"
                                    onChange={(e) => setNavStyle(e.target.value)}
                                    checked={appNavStyle === 'navbar-hidden'}
                                />
                                <label htmlFor="navbar-hidden">Hidden</label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="navbarType"
                                    value="navbar-static"
                                    id="navbar-static"
                                    onChange={(e) => setNavStyle(e.target.value)}
                                    checked={appNavStyle === 'navbar-static'}
                                />
                                <label htmlFor="navbar-static">Static</label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="navbarType"
                                    value="navbar-sticky"
                                    id="navbar-sticky"
                                    onChange={(e) => setNavStyle(e.target.value)}
                                    checked={appNavStyle === 'navbar-sticky'}
                                />
                                <label htmlFor="navbar-sticky">Fixed</label>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <hr />

                <h5>Footer Type</h5>
                <div className="footer-type d-flex justify-content-start">
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="footerType"
                                    value="footer-hidden"
                                    id="footer-hidden"
                                    onChange={(e) => setFooterStyle(e.target.value)}
                                    checked={appFooterStyle === 'footer-hidden'}
                                />
                                <label htmlFor="footer-hidden">Hidden</label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="footerType"
                                    value="footer-static"
                                    id="footer-static"
                                    onChange={(e) => setFooterStyle(e.target.value)}
                                    checked={appFooterStyle === 'footer-static'}
                                />
                                <label htmlFor="footer-static">Static</label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mx-50">
                        <fieldset>
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="footerType"
                                    value="fixed-footer"
                                    id="footer-sticky"
                                    onChange={(e) => setFooterStyle(e.target.value)}
                                    checked={appFooterStyle === 'fixed-footer'}
                                />
                                <label htmlFor="footer-sticky" className="">
                                    Sticky
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <hr />
            </div>
        </>
    );
};
