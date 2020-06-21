import { SIDEBAR_STATUS } from '../actions/sidebar-action';
import { getCookie, setCookie } from '../utils/app-utils';

const sStatus = getCookie('sidebar-status');

const initialState = { status: window.innerWidth <= 768 ? 'close' : sStatus ? sStatus : 'open' };

export function sidebarReducer(state = initialState, action) {
    if (SIDEBAR_STATUS === action.type) {
        setCookie('sidebar-status', action.payload.status);
        return { ...state, status: action.payload.status };
    }
    return state;
}
