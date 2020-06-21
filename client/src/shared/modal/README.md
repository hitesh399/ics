## Installation

### Open App.js file and wirte the below code
```js
 import { AppModalProvider } from '@/shared/modal/AppModalProvider'; 
```
### Add AppModalProvider component inside the render method.
```js
    render () {
        return (
            <Router >
                <AppModalProvider />
            </Router>
        );
    }
```

## How to use ConfirmBox
```js
    import { AppModal } from '@/shared/modal/app-modal-utils';

    AppModal.confirmBox(MessageComponent: React.Component | String | HTML, callback: Function, options: object)
```
| Params             |  Type                               | Default       | Description
|--------------------|-------------------------------------|---------------|------------------------------------------------
| MessageComponent   | React.Component / String / HTML     | required      | Message to display on confirmbox
| callback           | Function({busy, close }) {}         | None          | That call when user click on confirm button, this function also have a one inner scope object that contains , busy(To m make the dialog busy, utill your required does not reslove) and close (to destory the dialog) method
| options            | object                              | {}            | To pass the bootstart modal props

| option props       |  Type         | Default       | Description
|--------------------|---------------|---------------|------------------------------------------------------------------------
| title              | string/component| null        | Dialog Title (Title will not display if value is blank)
| waitLabel          | string/component|             | Wait label when the dialog is busy
| okBtnLabel         | string/component|             | Confirm Button Label
| cancelBtnLabel     | string/component|             | Cancel Button Label
| animation          | boolean       | true          | Open and close the Modal with a slide and fade animation.
| autoFocus          | boolean       | true          | When true The modal will automatically shift focus to itself when it opens, and replace it to the last focused element when it closes. Generally this should never be set to false as it makes the Modal less accessible to assistive technologies, like screen-readers.
| backdrop           | static/true/false | static     | Include a backdrop component. Specify 'static' for a backdrop that doesn't trigger an "onHide" when clicked.
| backdropClassName  | string  |  | Add an optional extra class name to .modal-backdrop It could end up looking like class="modal-backdrop foo-modal-backdrop in".
| centered           | boolean | false | vertically center the Dialog in the window
| container          | any     |       |
| dialogAs           | elementType | <ModalDialog> | A Component type that provides the modal content Markup. This is a useful prop when you want to use your own styles and markup to create a custom modal component.
| dialogClassName    | string | | A css class to apply to the Modal dialog DOM node.
| enforceFocus       | boolean | true | When true The modal will prevent focus from leaving the Modal while open. Consider leaving the default value here, as it is necessary to make the Modal work well with assistive technologies, such as screen readers.
| keyboard | boolean | true | Close the modal when escape key is pressed
| manager  | object  |     | A ModalManager instance used to track and manage the state of open Modals. Useful when customizing how modals interact within a container.

