import React from 'react';
import { Link } from 'react-router-dom';

export const AppBreadcrumb = ({ title, menu = [] }) => {
    return (
        <div className="content-header row">
            <div className="content-header-left col-12 mb-4 mt-3">
                <div className="row breadcrumbs-top">
                    <div className="col-12">
                        <h5 className="content-header-title float-left pr-3 mb-0">{title}</h5>
                        <div className="breadcrumb-wrapper col-12 d-none d-lg-block d-xl-block">
                            <ol className="breadcrumb p-0 mb-0">
                                {menu.map(({ to, title }, index) => (
                                    <li
                                        className={`breadcrumb-item ${
                                            index === menu.length - 1 ? 'active' : ''
                                        }`}
                                        key={`_breadcrumb_${title}`}>
                                        {to ? <Link to="/admin">{title}</Link> : title}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
