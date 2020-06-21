import React from 'react';
import { Modal } from 'react-bootstrap';
import { AppModalConsumer } from './AppModalConsumer';
import { renderDyamicComponent, guidGenerator } from '../../utils/app-utils';

export class AppModalProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modals: [],
        };
    }
    open(message, modalProps = {}, componentProps = {}, destroyCallback = null) {
        const id = guidGenerator();
        const destroy = this.destroy.bind(this, id);
        const close = this.close.bind(this, id);
        let { modals } = this.state;
        const { title = '', showCloseBtn = false } = modalProps;

        delete modalProps.title;
        delete modalProps.showCloseBtn;
        delete modalProps.delayToDestroy;

        modals.push({
            id,
            message,
            hidden: false,
            isBusy: false,
            title,
            destroyCallback,
            showCloseBtn,
            componentProps,
            modalProps,
        });
        this.setState({ modals: modals.slice() });

        return {
            destroyModal: destroy,
            closeModal: close,
            id,
            busy: this.busy.bind(this, id),
        };
    }
    destroy(id) {
        let { modals } = this.state;
        const modalIndex = modals.findIndex((value) => value.isBusy === false && value.id === id);
        if (modalIndex !== -1) {
            modals.splice(modalIndex, 1);
            this.setState({ modals: modals.slice() });
        }
    }
    close(id, reason) {
        let callback;
        let { modals } = this.state;
        let isFound = false;
        modals.map((modal) => {
            if (modal.id === id && modal.isBusy === false) {
                isFound = true;
                if (modal.destroyCallback && typeof modal.destroyCallback === 'function') {
                    callback = modal.destroyCallback;
                }
                modal.hidden = true;
            }
            return modal;
        });

        if (isFound) {
            this.setState({ modals: modals.slice() });
            if (callback) callback(reason);
        }
    }
    busy(id, status = true) {
        let { modals } = this.state;
        modals.map((modal) => {
            if (modal.id === id) {
                modal.isBusy = status;
            }
            return modal;
        });

        this.setState({ modals: modals.slice() });
    }
    componentDidMount() {
        // history.listen(() => {
        //     // When Location Change closing the popup
        //     this.state.modals.forEach((modal) => {
        //         this.close(modal.id, 'close');
        //     });
        // });
    }
    render() {
        const { modals } = this.state;
        const modalLength = modals.length;
        return (
            <>
                <AppModalConsumer open={this.open.bind(this)}></AppModalConsumer>
                {modals.map((modal, modalIndex) => (
                    <ModalComponent
                        key={`${modal.id}_modal_id`}
                        modal={modal}
                        destroy={this.destroy.bind(this, modal.id)}
                        close={(reason = 'close') => this.close.bind(this, modal.id, reason)()}
                        modalLength={modalLength}
                        modalIndex={modalIndex}
                        busy={(status = true) =>
                            this.busy.bind(this, modal.id, status)()
                        }></ModalComponent>
                ))}
            </>
        );
    }
}

const ModalComponent = ({
    modal: { title, message, showCloseBtn, id, isBusy, hidden, componentProps, modalProps },
    modalLength,
    modalIndex,
    destroy,
    close,
    busy,
}) => {
    const componetProps = {
        close,
        busy,
        modalId: id,
        hidden,
        isBusy,
        title,
        ...componentProps,
    };

    return (
        <Modal
            {...modalProps}
            show={!hidden}
            style={{ zIndex: modalLength === modalIndex + 1 ? 1050 : 1 }}
            onExited={destroy}
            onHide={() => close('close')}>
            <>
                {title ? (
                    <Modal.Header closeButton={showCloseBtn}>
                        <Modal.Title>{renderDyamicComponent(title)}</Modal.Title>
                    </Modal.Header>
                ) : null}
                {renderDyamicComponent(message, componetProps)}
            </>
        </Modal>
    );
};
