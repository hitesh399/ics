import React, { useContext } from 'react';
import { AppListContext } from './AppList';
import { intersection } from 'lodash';
import { Form, FormCheck } from 'react-bootstrap';
import { listToggleSelectAll, listToggleSelect } from './app-list-action';

export const AppListSelectAll = ({ label = <span>&nbsp;</span> }) => {
    const { selected, data, primaryKey, name, requesting, dispatch } = useContext(AppListContext);
    const ids = data.map((item) => item[primaryKey]);
    const intersectedIds = intersection(selected, ids);
    const isAllSelected = ids.length && intersectedIds.length === ids.length;
    const isIndeterminate = !isAllSelected && intersectedIds.length ? true : false;
    const handleChange = () => {
        dispatch(listToggleSelectAll());
    };
    return (
        <Form.Check custom id={`select_all_${name}`} disabled={requesting} type="checkbox">
            <FormCheck.Input
                type="checkbox"
                disabled={requesting}
                checked={isAllSelected}
                onChange={handleChange}
                ref={(input) => {
                    if (input) {
                        input.indeterminate = isIndeterminate;
                    }
                }}
            />
            <FormCheck.Label htmlFor={`select_all_${name}`}>{label}</FormCheck.Label>
        </Form.Check>
    );
};

export const AppListSelect = ({ id, label = <span>&nbsp;</span> }) => {
    const { selected, name, requesting, dispatch } = useContext(AppListContext);
    const isSelected = selected.includes(id);

    const handleChange = () => {
        dispatch(listToggleSelect(id));
    };
    return (
        <Form.Check
            custom
            label={label}
            id={`select_${name}_${id}`}
            checked={isSelected}
            onChange={handleChange}
            disabled={requesting}
            type="checkbox"
        />
    );
};
