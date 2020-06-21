import React, { useContext, useCallback } from 'react';
import classNames from 'classnames';
import { AppListContext } from './AppList';
import { useField } from 'formik';
import { get } from 'lodash';
import { listAddSelectedRows } from './app-list-action';

export const AppListSortableTh = ({ name, children }) => {
    const { multiSorting, selected, dispatch, refresh, autoFilter } = useContext(AppListContext);
    // const sortField = useField('sort');
    const [field, , helpers] = useField('sort');
    const value = get(field, ['value', name], null);

    const allValue = get(field, ['value'], {});
    const handleOnClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (selected.length) {
            dispatch(listAddSelectedRows([]));
        }
        const val = { [name]: value === 'asc' ? 'desc' : 'asc' };
        const newValue = multiSorting ? { ...allValue, ...val } : val;
        helpers.setValue(newValue);
        if (!autoFilter) {
            setTimeout(() => refresh(), 0);
        }
    };

    const clearSorting = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (value) {
            if (selected.length) {
                dispatch(listAddSelectedRows([]));
            }

            helpers.setValue(multiSorting ? { ...allValue, ...{ [name]: null } } : {});
            if (!autoFilter) {
                setTimeout(() => refresh(), 0);
            }
        }
    };
    const icon = useCallback(() => {
        if (value === 'desc') {
            return 'fas fa-sort-alpha-down-alt';
        } else if (value === 'asc') {
            return 'fas fa-sort-alpha-down';
        } else {
            return 'fas fa-sort-alpha-down disable';
        }
    }, [value]);

    return (
        <th onClick={handleOnClick} className={classNames({ sorting: true, [value]: !!value })}>
            <span className="label">{children}</span>
            {/* {JSON.stringify(value)} */}
            {value ? (
                <i
                    title="clear sorting"
                    onClick={clearSorting}
                    className="fas fa-times-circle clear-sorting"
                />
            ) : null}
            <span className="sorting--icon">
                <i className={icon()} />
            </span>
        </th>
    );
};
