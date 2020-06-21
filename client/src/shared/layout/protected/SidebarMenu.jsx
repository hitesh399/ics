import React from 'react';
import classNames from 'classnames';
import { Link, matchPath, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { renderDyamicComponent } from '../../../utils/app-utils';

export class SidebarMenuComponent extends React.PureComponent {
    renderMenuItem({ children, to, title, icon, itemComponent }) {
        if (children && children.length) {
            return (
                <SidebarMenuItem
                    to={to}
                    key={`menu_item${title}`}
                    title={title}
                    itemComponent={itemComponent}
                    currentPath={this.props.location.pathname}
                    isAnyChildrenActive={this.checkedChildrenActive(children)}
                    icon={icon}>
                    <ul className="menu-content">
                        {children.map((item) => this.renderMenuItem(item))}
                    </ul>
                </SidebarMenuItem>
            );
        }
        return (
            <SidebarMenuItem
                currentPath={this.props.location.pathname}
                to={to}
                itemComponent={itemComponent}
                key={`menu_item${title}`}
                title={title}
                icon={icon}
            />
        );
    }
    checkedChildrenActive = (items) => {
        const { location } = this.props;
        return items.some((item) => {
            const matched = matchPath(location.pathname, { path: item.to, exact: true });
            if (matched) {
                return true;
            } else if (item.children && item.children.length) {
                return this.checkedChildrenActive(item.children);
            } else {
                return false;
            }
        });
    };
    render() {
        const { menuItems } = this.props;
        return (
            <ul className="navigation navigation-main" id="main-menu-navigation">
                {menuItems.map((item) => this.renderMenuItem(item))}
            </ul>
        );
    }
}
export const SidebarMenu = withRouter(SidebarMenuComponent);

SidebarMenuComponent.propTypes = {
    menuItems: PropTypes.array.isRequired,
};

export class SidebarMenuItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    componentDidMount() {
        if (this.props.isAnyChildrenActive && !this.state.open) {
            this.setState({ open: true });
        }
    }
    componentDidUpdate(preProps) {
        if (preProps.currentPath !== this.props.currentPath) {
            // Nav is Changed.
            if (!this.props.isAnyChildrenActive && this.state.open) {
                this.setState({ open: false });
            }
        }
    }
    handleToggleOpen = (e) => {
        e.preventDefault();
        if (this.props.children) {
            this.setState({ open: !this.state.open });
        }
    };
    render() {
        const {
            currentPath,
            isAnyChildrenActive,
            title,
            icon,
            children,
            to,
            itemComponent,
        } = this.props;
        const { open } = this.state;
        const hasChildren = !!children;
        const matched = matchPath(currentPath, {
            path: to,
            exact: true,
        });
        const DefaultItemComponent = hasChildren ? SidebarMenuItemText : SidebarMenuItemLink;
        const MenuItemComponet = itemComponent ? itemComponent : DefaultItemComponent;
        return (
            <li
                className={classNames({
                    'nav-item': true,
                    'has-sub': hasChildren,
                    active: matched,
                    'sidebar-group-active': isAnyChildrenActive,
                    open: open,
                    
                })}>
                {renderDyamicComponent(MenuItemComponet, {
                    handleToggleOpen: this.handleToggleOpen,
                    title,
                    to,
                    icon,
                })}
                {children}
            </li>
        );
    }
}

const SidebarMenuItemLink = ({ to, title, icon }) => (
    <Link to={to}>
        {icon ? <i className={icon}></i> : null}
        <span className="menu-title" title={title}>
            {title}
        </span>
    </Link>
);

const SidebarMenuItemText = ({ handleToggleOpen, title, icon }) => (
    <button className="link" onClick={handleToggleOpen}>
        {icon ? <i className={icon}></i> : null}
        <span className="menu-title" title={title}>
            {title}
        </span>
    </button>
);
