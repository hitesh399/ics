import { EventManager } from '../../event-manager';

export const AppModal = {
    /**
     * To render the Bootstrap Modal as confirmation box.
     *
     * @param {string JsxObject ReactComponent} message - Message to display on Modal body
     * @param {Function} confirmFnc - To call the function to confirm button click
     * @param {Object} option - {title, waitLabel, okBtnLabel, cancelBtnLabel}
     *
     * @returns {Promise} - promise instance when dialog destroy from DOM.
     */
    confirmBox: (message, confirmFnc, option = {}) => {
        const out = EventManager.dispatch('app-open-modal', {
            message,
            confirmFnc,
            ...option,
            appModalType: 'confirm',
        });
        return out[0];
    },
    /**
     * To render the Bootstrap modal as MessageBox
     *
     * @param {String JSXObject ReactComponent} message - Modal Message
     * @param {String JSXObject } title - Modal title
     *
     * @returns {Promise} -
     */
    messageBox: (message, title, callback) => {
        const out = EventManager.dispatch('app-open-modal', {
            message,
            title,
            appModalType: 'message',
            callback,
        });
        return out[0];
    },

    /**
     * To render the Bootstrap modal as Dialog, Here you can pass your custom component to render inside Bootstrap Modal.
     *
     * @param {String JSXObject ReactComponent} message - Modal Body Component, If you pass a ReactComponet then you will receive some props: like: {close:Function, busy(true): Function, isBusy: Boolean},
     * @param { Object } modalProps - Bootstrap Modal props
     * @param {Object} messageComponentProps - MessageComponent Props, If you are passing ReactComponent|PureComponent|FunctionalComponent
     *
     * @returns {Promise} -
     */
    open: (message, modalProps, messageComponentProps) => {
        const out = EventManager.dispatch('app-open-modal', {
            message,
            modalProps,
            messageComponentProps,
            appModalType: 'modal',
        });
        return out[0];
    },
    sideDrawer: (message, options) => {
        const out = EventManager.dispatch('app-open-modal', {
            ...options,
            message,
            appModalType: 'sideDrawer',
        });
        return out[0];
    },
};

export function getOnlyProps(props, only = []) {
    const newProps = {};
    const propsKeys = Object.keys(props);

    propsKeys.forEach((key) => {
        if (only.includes(key)) {
            newProps[key] = props[key];
        }
    });

    return newProps;
}

export function getAllPropsExcept(props, except = []) {
    const newProps = {};
    const propsKeys = Object.keys(props);
    propsKeys.forEach((key) => {
        if (!except.includes(key)) {
            newProps[key] = props[key];
        }
    });

    return newProps;
}
