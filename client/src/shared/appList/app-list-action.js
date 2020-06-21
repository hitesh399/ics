import { get, intersection } from 'lodash';

export const SET_LIST_DATA = 'SET_LIST_DATA';
export const PUSH_LIST_DATA = 'PUSH_LIST_DATA';
export const CHANGE_LIST_REQUEST_STATUS = 'CHANGE_LIST_REQUEST_STATUS';
export const SET_LIST_PRIMARY_KEY = 'SET_LIST_PRIMARY_KEY';
export const DESTROY_LIST = 'DESTROY_LIST';
export const LIST_SERVER_STATUS = 'LIST_SERVER_STATUS';
export const LIST_SET_SELECTED_ROW = 'LIST_SET_SELECTED_ROW';

export function setListServerStatus(status, error) {
    return {
        type: LIST_SERVER_STATUS,
        payload: {
            status,
            error,
        },
    };
}
/**
 *
 * @param {Array} data  list Data
 * @param {Number} Which page data going to push in collection
 *
 * @return Object
 */
export function setListData(data, page, total, info) {
    return {
        type: SET_LIST_DATA,
        payload: {
            data,
            page,
            total,
            info,
        },
    };
}
/**
 *
 * @param {Array} data list Data to push in collection
 * @param {Number} Which page data going to push in collection
 *
 * @return Object
 */
export function pushListData(data, page, total, info) {
    return {
        type: PUSH_LIST_DATA,
        payload: {
            data,
            page,
            total,
            info,
        },
    };
}

/**
 *
 * @param {Boolean} status current request status
 *
 * @return Object
 */
export function changeListRequestStatus(status) {
    return {
        type: CHANGE_LIST_REQUEST_STATUS,
        payload: {
            requestStatus: status,
        },
    };
}

/**
 * To Toggle the select all row on page
 *
 * @param {String} listName - to recognize a list
 *
 * @returns {Object} - Action Payload
 */
export function listToggleSelectAll() {
    return (dispatch, getState) => {
        // console.log('store', store(), dispatch)
        const store = getState();
        const data = get(getState(), ['data'], []);
        const primaryKey = get(store, ['meta', 'primaryKey'], 'id');
        const dataIds = data.map((d) => d[primaryKey]);
        const selected = get(store, ['selected'], []);

        const intersectedIds = intersection(selected, dataIds);

        const isAllSelected = data.length && intersectedIds.length === data.length;
        const newSelectedRows = isAllSelected
            ? selected.filter((selectedId) => !dataIds.includes(selectedId))
            : selected.concat(dataIds);

        dispatch(listAddSelectedRows(newSelectedRows));
    };
}
/**
 * To Toggle the select a row on page
 *
 * @param {String} listName - to recognize a list
 * @param {any} id - Primary key value of list
 *
 * @returns {Object} - Action Payload
 */
export function listToggleSelect(id) {
    return (dispatch, getState) => {
        const store = getState();
        const selected = get(store, ['selected'], []);
        const isSelected = selected.some((selectedId) => selectedId === id);
        const newSelectedRows = isSelected
            ? selected.filter((selectedId) => selectedId !== id)
            : selected.concat([id]);
        dispatch(listAddSelectedRows(newSelectedRows));
    };
}

/**
 *
 * @param {Array} rowIds - Selected Row ids
 *
 * @returns {Object} - Action Payload
 */
export function listAddSelectedRows(rowIds = []) {
    return {
        type: LIST_SET_SELECTED_ROW,
        payload: {
            selectedRows: rowIds,
        },
    };
}
