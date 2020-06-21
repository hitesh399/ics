import {
    SET_LIST_DATA,
    PUSH_LIST_DATA,
    CHANGE_LIST_REQUEST_STATUS,
    LIST_SERVER_STATUS,
    LIST_SET_SELECTED_ROW,
} from './app-list-action';

import { get, concat } from 'lodash';

/**
 *-------------------------------------------------------
 * Data Schema, which we use to store the list data
 *-------------------------------------------------------
 *  
 *    {
 *        data: Array[Object],
 *        info: Object,
 *        requesting: Boolean,
 *        status: 'success' | 'fail'
 *        error: any,
 *        shouldUpdate: Boolean, that is only to recognized that any modification is happned into a perticular list.
 *        meta: {currentPage, total, primaryKey},
 *        lastUpdatedAt: Date,
 *        selected: []
 *    }

 *
 */
const ALL_ACTIONS = [
    SET_LIST_DATA,
    PUSH_LIST_DATA,
    CHANGE_LIST_REQUEST_STATUS,
    LIST_SERVER_STATUS,
    LIST_SET_SELECTED_ROW,
];

export function appListReducer(state, action) {
    if (!ALL_ACTIONS.includes(action.type)) return state;

    const shouldUpdate = state.shouldUpdate;
    const data = get(action, ['payload', 'data'], []);
    const page = get(action, ['payload', 'page']);
    const total = get(action, ['payload', 'total']);
    const requestStatus = get(action, ['payload', 'requestStatus']);
    const info = get(action, ['payload', 'info']);
    const status = get(action, ['payload', 'status']);
    const error = get(action, ['payload', 'error']);
    const selectedRows = get(action, ['payload', 'selectedRows']);

    if (action.type === SET_LIST_DATA) {
        // set(state, [name, 'data'], data);
        state.data = data;
        state.meta.currentPage = page;
        if (total !== undefined) {
            state.meta.total = total;
        }
        state.lastUpdatedAt = new Date();
        if (info !== undefined) {
            state.info = info;
        }
        state.shouldUpdate = !shouldUpdate;
        return { ...state };
    } else if (action.type === PUSH_LIST_DATA) {
        const oldData = state.data.slice();
        state.data = concat(oldData, data);
        state.lastUpdatedAt = new Date();
        state.meta.currentPage = page;
        if (total !== undefined) {
            state.meta.total = total;
        }
        if (info !== undefined) {
            state.info = info;
        }
        state.shouldUpdate = !shouldUpdate;
        return { ...state };
    } else if (action.type === CHANGE_LIST_REQUEST_STATUS) {
        state.requesting = requestStatus;
        state.shouldUpdate = !shouldUpdate;
        return { ...state };
    } else if (action.type === LIST_SERVER_STATUS) {
        state.status = status;
        state.error = error;
        state.requesting = false;
        state.shouldUpdate = !shouldUpdate;
        return { ...state };
    } else if (action.type === LIST_SET_SELECTED_ROW) {
        state.selected = selectedRows;
        state.shouldUpdate = shouldUpdate;
        return { ...state };
    } else {
        return state;
    }
}
