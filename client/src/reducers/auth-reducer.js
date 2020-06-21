import { AUTH_UPDATE_USER_DATA, AUTH_CLEAR_USER_DATA } from '../actions/auth-action';

export const authReducer = (state = { user: null, checked: false }, action) => {
    if (AUTH_UPDATE_USER_DATA === action.type) {
        state.user = action.payload.user;
        state.checked = true;
        return { ...state };
    } else if (AUTH_CLEAR_USER_DATA === action.type) {
        state.user = null;
        state.checked = true;
        return { ...state };
    }
    return state;
};
