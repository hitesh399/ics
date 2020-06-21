import React from 'react';

export class AuthLayout extends React.PureComponent {
    componentDidMount() {
        document.body.className =
            'vertical-layout vertical-menu-modern semi-dark-layout 1-column  navbar-sticky footer-static bg-full-screen-image  blank-page blank-page';
    }
    render() {
        const { children } = this.props;
        return (
            <div className="app-content content">
                <div className="content-overlay"></div>
                <div className="content-wrapper">
                    <div className="content-header row"></div>
                    <div className="content-body">
                        <section className="row flexbox-container">
                            <div className="col-xl-8 col-11">
                                <div className="card bg-authentication mb-0">{children}</div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
