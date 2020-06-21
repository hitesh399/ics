import React, { useRef, useEffect, useState } from 'react';
import { AppInput } from './Fields';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Form } from 'react-bootstrap';
import { request } from '../../utils/axios-utils';
import { get, groupBy } from 'lodash';
import axios from 'axios';

function makeGroupOptions(myOptions, groupByKey) {
    let groupOptions = {};

    groupOptions = groupBy(myOptions, function (opt) {
        const key = get(opt, groupByKey);
        return key ? key : 'Uncategorized';
    });

    const groupOptionsLabel = Object.keys(groupOptions);
    return groupOptionsLabel.map((groupLabel) => {
        return {
            label: groupLabel,
            options: groupOptions[groupLabel],
        };
    });
}

const NativeOption = ({ options, getOptionValue, getOptionLabel }) => {
    return options.map((option) => (
        <option key={`native_select_${getOptionValue(option)}`} value={getOptionValue(option)}>
            {getOptionLabel(option)}
        </option>
    ));
};

const NativeGroupOption = ({ options, getOptionValue, getOptionLabel, groupByKey }) => {
    const groupOptions = makeGroupOptions(options, groupByKey);
    return groupOptions.map((groupOption) => {
        return (
            <optgroup label={groupOption.label} key={`native_group_option_${groupOption.label}`}>
                <NativeOption
                    options={groupOption.options}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                />
            </optgroup>
        );
    });
};

export const AppReactSelect = ({
    action,
    dataKey = 'data',
    method = 'get',
    payload,
    isMulti,
    options,
    isCreatable,
    styles = {},
    groupByKey,
    ...props
}) => {
    const [asyncOptions, setAsyncOptions] = useState([]);
    useEffect(() => {
        const fnc = async () => {
            const response = await request({
                method,
                url: action,
                params: payload,
            });
            setAsyncOptions(get(response, `data.${dataKey}`));
        };
        fnc();
    }, [action, dataKey, method, payload]);

    return (
        <AppInput {...props} multiple={isMulti}>
            {(inputProps, { touched }, { setTouched }) => {
                const { disabled: isDisabled, multiple: isMulti, ...restProps } = inputProps;
                const customStyles = {
                    control: (provided) => ({
                        ...provided,
                        ...(inputProps.isInvalid ? { borderColor: '#dc3545' } : {}),
                    }),
                    ...styles,
                };
                const myOptions = action ? asyncOptions : options;

                return React.createElement(isCreatable ? CreatableSelect : Select, {
                    options: groupByKey ? makeGroupOptions(myOptions, groupByKey) : myOptions,
                    isMulti,
                    isDisabled,
                    ...restProps,
                    styles: customStyles,
                    onMenuClose: () => {
                        if (!touched) {
                            setTouched(true);
                        }
                        if (typeof restProps.onMenuClose === 'function') {
                            restProps.onMenuClose();
                        }
                    },
                });
            }}
        </AppInput>
    );
};

export const AppSelect = ({
    action,
    dataKey = 'data',
    method = 'get',
    payload,
    options,
    getOptionValue = (item) => item.value,
    getOptionLabel = (item) => item.label,
    groupByKey,
    ...props
}) => {
    const [asyncOptions, setAsyncOptions] = useState([]);
    useEffect(() => {
        const fnc = async () => {
            const response = await request({
                method,
                url: action,
                params: payload,
            });
            setAsyncOptions(get(response, `data.${dataKey}`));
        };
        fnc();
    }, [action, dataKey, method, payload]);
    const myOptions = action ? asyncOptions : options;
    return (
        <AppInput {...props}>
            {(inputProps) => {
                return (
                    <Form.Control as="select" {...inputProps}>
                        {inputProps.placeholder ? <option>{inputProps.placeholder}</option> : null}
                        {groupByKey ? (
                            <NativeGroupOption
                                options={myOptions}
                                getOptionValue={getOptionValue}
                                getOptionLabel={getOptionLabel}
                                groupByKey={groupByKey}
                            />
                        ) : (
                            <NativeOption
                                options={myOptions}
                                getOptionValue={getOptionValue}
                                getOptionLabel={getOptionLabel}
                            />
                        )}
                    </Form.Control>
                );
            }}
        </AppInput>
    );
};

export const AppReactAyncSelect = ({
    action,
    loadOptions,
    payload = {},
    searchKey = 'search',
    method = 'get',
    dataKey = 'data',
    isMulti,
    onError,
    isCreatable,
    styles,
    groupByKey,
    ...props
}) => {
    const axiosInst = useRef();
    const handleLoadOptions = async (inputValue) => {
        if (typeof loadOptions === 'function') {
            return loadOptions(inputValue);
        } else if (action) {
            try {
                if (axiosInst.current) {
                    const oldSource = axiosInst.current;
                    oldSource.cancel('overlapping');
                    oldSource.token.promise.then((error) => {
                        return Promise.resolve(error);
                    });
                }
                axiosInst.current = axios.CancelToken.source();
                const response = await request({
                    method,
                    url: action,
                    cancelToken: axiosInst.current.token,
                    params: {
                        [searchKey]: inputValue,
                        ...payload,
                    },
                });
                const remoteOptions = get(response, `data.${dataKey}`);
                return groupByKey ? makeGroupOptions(remoteOptions, groupByKey) : remoteOptions;
            } catch (e) {
                if (e.message !== 'overlapping') {
                    if (typeof onError === 'function') {
                        onError(e);
                    }
                }
            }
        }
        return null;
    };
    return (
        <AppInput {...props} multiple={isMulti}>
            {(inputProps, { touched }, { setTouched }) => {
                const customStyles = {
                    control: (provided) => ({
                        ...provided,
                        ...(inputProps.isInvalid ? { borderColor: '#dc3545' } : {}),
                    }),
                    ...styles,
                };
                const { disabled: isDisabled, multiple: isMulti, ...restProps } = inputProps;
                return React.createElement(isCreatable ? AsyncCreatableSelect : AsyncSelect, {
                    isMulti,
                    isDisabled,
                    ...restProps,
                    loadOptions: handleLoadOptions,
                    styles: customStyles,
                    onMenuClose: () => {
                        if (!touched) {
                            setTouched(true);
                        }
                        if (typeof restProps.onMenuClose === 'function') {
                            restProps.onMenuClose();
                        }
                    },
                });
            }}
        </AppInput>
    );
};
