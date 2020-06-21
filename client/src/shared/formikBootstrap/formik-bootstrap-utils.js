export function mapPropsEvent(props, input, helper) {
    let onlyInputProps = { ...props, ...input };

    onlyInputProps.onChange = (e) => {
        let event = e;
        if (e && typeof e === 'object' && !e.hasOwnProperty('currentTarget')) {
            event = { currentTarget: { value: e, name: input.name } };
        }
        if (event.currentTarget.type === 'file') {
            const files = [];
            for (let i = 0; i < event.currentTarget.files.length; i++) {
                files.push(event.currentTarget.files[i]);
            }
            event = {
                currentTarget: {
                    value: onlyInputProps.multiple
                        ? [...(onlyInputProps.value ? onlyInputProps.value : []), ...files]
                        : files[0],
                    name: input.name,
                    type: 'file',
                },
            };
        }
        input.onChange(event);
        if (props.onChange && typeof props.onChange === 'function') {
            props.onChange(e, helper);
        }
    };
    if (props.onBlur) {
        onlyInputProps.onBlur = (e) => {
            input.onBlur(e);
            props.onBlur(e);
        };
    }
    return onlyInputProps;
}
