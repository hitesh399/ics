import React, { useState, useEffect } from 'react';
import { EventManager } from '../../event-manager';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { renderDyamicComponent } from '../../utils/app-utils';
import { getAllPropsExcept, getOnlyProps } from './app-modal-utils';

export class AppModalConsumer extends React.PureComponent {
    handleModalOpen(props) {
        let outout;
        switch (props.appModalType) {
            case 'confirm':
                outout = this.openConfirmBox(props);
                break;
            case 'message':
                this.openMessageBox(props);
                break;
            case 'sideDrawer':
                outout = this.openSideDrawer(props);
                break;
            case 'modal':
                outout = this.openModal(
                    props.message,
                    props.modalProps,
                    props.messageComponentProps,
                );
                break;
            default:
                break;
        }
        return outout;
    }

    openConfirmBox(props) {
        return new Promise((resolve, reject) => {
            const func = (reason) => {
                reason === 'close' ? reject(reason) : resolve(reason);
            };
            const componentProps = [
                'message',
                'confirmFnc',
                'title',
                'waitLabel',
                'okBtnLabel',
                'cancelBtnLabel',
                'appModalType',
            ];

            this.props.open(
                ModalConfirmConponent,
                {
                    backdrop: 'static',
                    ...getAllPropsExcept(props, componentProps),
                },
                { ...getOnlyProps(props, componentProps), resolve },
                func,
            );
        });
    }
    openMessageBox(props) {
        const componetProps = ['message', 'title', 'btnLabel', 'close', 'appModalType'];
        this.props.open(
            ModalMessageConponent,
            getAllPropsExcept(props, componetProps),
            getOnlyProps(props, componetProps),
            props.callback,
        );
    }
    openModal(messageComponent, modalProps, messageComponentProps) {
        return new Promise((resolve, reject) => {
            const func = (reason) => {
                reason === 'close' ? reject(reason) : resolve(reason);
            };
            this.props.open(messageComponent, modalProps, messageComponentProps, func);
        });
    }
    openSideDrawer(props) {
        return new Promise((resolve, reject) => {
            const func = (reason) => {
                reason === 'close' ? reject(reason) : resolve(reason);
            };

            this.props.open(ModalSideDrawer, { dialogAs: 'div', backdrop: false }, props, func);
        });
    }
    componentDidMount() {
        EventManager.on('app-open-modal', this.handleModalOpen.bind(this));
    }
    componentWillUnmount() {
        EventManager.off('app-open-modal', this.handleModalOpen);
    }

    render() {
        return null;
    }
}

const ModalConfirmConponent = ({
    message,
    confirmFnc,
    busy,
    close,
    title,
    waitLabel = <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />,
    okBtnLabel = <i className="bx bx-check"></i>,
    cancelBtnLabel = <i className="bx bx-x"></i>,
    isBusy,
}) => {
    const fnc = () =>
        typeof confirmFnc === 'function'
            ? confirmFnc({
                  close: () => {
                      busy(false);
                      close('success');
                  },
                  busy,
              })
            : close('success');
    return (
        <>
            {title ? (
                <Modal.Header closeButton>
                    <Modal.Title>{renderDyamicComponent(title)}</Modal.Title>
                </Modal.Header>
            ) : null}
            <Modal.Body>{renderDyamicComponent(message)}</Modal.Body>
            <Modal.Footer>
                <Button disabled={isBusy} variant="secondary" onClick={() => close('cancel')}>
                    {cancelBtnLabel}
                </Button>
                <Button disabled={isBusy} variant="primary" onClick={fnc}>
                    {isBusy ? waitLabel : okBtnLabel}
                </Button>
            </Modal.Footer>
        </>
    );
};

const ModalMessageConponent = ({ message, title, btnLabel = 'Ok', close }) => {
    return (
        <>
            {title ? (
                <Modal.Header closeButton>
                    <Modal.Title>{renderDyamicComponent(title)}</Modal.Title>
                </Modal.Header>
            ) : null}

            <Modal.Body>{renderDyamicComponent(message)}</Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="primary" onClick={close}>
                    {btnLabel}
                </Button>
            </Modal.Footer>
        </>
    );
};

const ModalSideDrawer = ({ message, hidden, close }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const showMe = function () {
            setShow(true);
        };
        showMe();
    }, []);
    return (
        <div className={`customizer ${!hidden && show ? 'open' : ''}`}>
            <button className="customizer-close link" onClick={close}>
                <i className="bx bx-x"></i>
            </button>
            <div className="customizer-content p-4 ps ps--active-y">
                {renderDyamicComponent(message)}
            </div>
        </div>
    );
};
