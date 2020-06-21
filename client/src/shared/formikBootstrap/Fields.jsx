import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { Form, InputGroup, FormCheck, Button, Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import { mapPropsEvent } from './formik-bootstrap-utils';

export const AppInput = ({
    className,
    disabled,
    label,
    groupProps,
    labelProps,
    id,
    showInlineError = true,
    name,
    highlightValidField = true,
    shouldDisableOnSubmitting = true,
    children,
    multiple = false,
    hint,
    ...props
}) => {
    const [input, { error, touched }, helper] = useField(name);
    const { submitCount, isSubmitting, displayName: formName } = useFormikContext();
    const isSubmitted = submitCount >= 1;
    const _id = id ? id : `${formName}_${name}`;

    const inputPrps = {
        isValid: touched && !error && highlightValidField,
        isInvalid: (touched || isSubmitted) && error,
        ...mapPropsEvent(props, input, helper),
        disabled: disabled || (isSubmitting && shouldDisableOnSubmitting),
        name,
        id,
        multiple,
    };
    return (
        <Form.Group
            className={classNames({
                [className]: !!className,
                valid: touched && !error && highlightValidField,
                invalid: (touched || isSubmitted) && error,
            })}
            {...groupProps}
            controlId={_id}>
            <LabelField label={label} {...labelProps} />
            {children ? (
                typeof children === 'function' ? (
                    children(inputPrps, { error, touched }, helper)
                ) : (
                    children
                )
            ) : (
                <Form.Control {...inputPrps} />
            )}
            <ErrorField
                error={error}
                touched={touched}
                isSubmitted={isSubmitted}
                showInlineError={showInlineError}
            />
            {hint ? <Form.Text className="text-muted">{hint}</Form.Text> : null}
        </Form.Group>
    );
};

export const AppInputGroup = ({ prepend, append, ...props }) => {
    return (
        <AppInput {...props}>
            {(inputProps) => (
                <InputGroup>
                    {prepend ? <InputGroup.Prepend>{prepend}</InputGroup.Prepend> : null}
                    <Form.Control {...inputProps} />
                    {append ? <InputGroup.Append>{append}</InputGroup.Append> : null}
                </InputGroup>
            )}
        </AppInput>
    );
};

export const AppInputPassword = (props) => {
    const [isPasswordType, setIsPasswordType] = useState(true);
    return (
        <AppInputGroup
            {...props}
            className="password-field"
            type={isPasswordType ? 'password' : 'text'}
            append={
                <i
                    onClick={() => setIsPasswordType(!isPasswordType)}
                    className={`fas fa-${isPasswordType ? 'eye' : 'eye-slash'}`}></i>
            }></AppInputGroup>
    );
};
export const AppCheck = ({
    showInlineError = true,
    id,
    label,
    name,
    disabled,
    labelProps,
    className,
    type,
    inline,
    highlightValidField = true,
    shouldDisableOnSubmitting,
    custom = true,
    multiple = false,
    checked,
    value,
    ...props
}) => {
    const inputType = type === 'radio' ? 'radio' : 'checkbox';
    const [input, { error, touched }] = useField({
        name,
        type: inputType,
        checked,
        value,
        multiple,
    });
    const { submitCount, isSubmitting, displayName: formName } = useFormikContext();
    const isSubmitted = submitCount >= 1;
    const _id = id ? id : `${formName}_${name}`;
    const isDisbaled = disabled || (isSubmitting && shouldDisableOnSubmitting);
    const inputPrps = {
        isValid: touched && !error && highlightValidField,
        isInvalid: (touched || isSubmitted) && error,
        ...mapPropsEvent(props, input),
        disabled: isDisbaled,
        name,
        id,
        value,
        checked,
        type: inputType,
    };
    return (
        <Form.Check
            id={_id}
            className={className}
            isValid={touched && !error && highlightValidField}
            isInvalid={(touched || isSubmitted) && error}
            type={type}
            inline={inline}
            custom={label && custom}
            disabled={isDisbaled}>
            <FormCheck.Input {...inputPrps} />
            {label ? (
                <FormCheck.Label html-for={_id} className="text-bold-600" {...labelProps}>
                    {label}
                </FormCheck.Label>
            ) : null}
            <ErrorField
                error={error}
                touched={touched}
                isSubmitted={isSubmitted}
                showInlineError={showInlineError}
            />
        </Form.Check>
    );
};

export const AppCheckGroup = ({
    type,
    options = [],
    showInlineError = true,
    name,
    valueKey = 'value',
    labelKey = 'label',
    heading,
    className,
    highlightValidField = true,
    headingProps,
    ...props
}) => {
    // eslint-disable-next-line no-unused-vars
    const [input, { error, touched }] = useField(name);

    const { submitCount } = useFormikContext();
    const isSubmitted = submitCount >= 1;
    return (
        <Form.Group
            className={classNames({
                [className]: !!className,
                valid: touched && !error && highlightValidField,
                invalid: (touched || isSubmitted) && error,
            })}>
            <LabelField label={heading} {...headingProps} />
            {options.map((option) => {
                const value = option[valueKey];
                const label = option[labelKey];
                return (
                    <AppCheck
                        key={`option_${value}`}
                        id={`${name}_${value}`}
                        label={label}
                        value={value}
                        name={name}
                        highlightValidField={highlightValidField}
                        multiple={true}
                        type={type}
                        showInlineError={false}
                        {...props}
                    />
                );
            })}
            <ErrorField
                error={error}
                touched={touched}
                isSubmitted={isSubmitted}
                showInlineError={showInlineError}
            />
        </Form.Group>
    );
};

export const AppSubmitBtn = ({
    children,
    className,
    label = 'Submit',
    waitLabel = 'Working...',
    ...props
}) => {
    const { isSubmitting } = useFormikContext();
    return (
        <Button
            disabled={isSubmitting}
            className={`glow position-relative ${className}`}
            type="submit"
            variant="primary"
            {...props}>
            {isSubmitting ? (
                <span>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span>{waitLabel}</span>
                </span>
            ) : null}
            {!isSubmitting ? children || label : null}
        </Button>
    );
};
export const ErrorField = ({ error, touched, isSubmitted, showInlineError }) =>
    ((error && touched) || isSubmitted) && showInlineError ? (
        <Form.Control.Feedback className="d-block" type="invalid">
            {error}
        </Form.Control.Feedback>
    ) : null;
export const LabelField = ({ label, ...porps }) =>
    label ? (
        <Form.Label className="text-bold-600" {...porps}>
            {label}
        </Form.Label>
    ) : null;
