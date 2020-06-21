export const AUTH_UPDATE_USER_DATA = 'AUTH_UPDATE_USER_DATA';
export const AUTH_CLEAR_USER_DATA = 'AUTH_CLEAR_USER_DATA';

export function updateAuthUserData(user) {
    return {
        type: AUTH_UPDATE_USER_DATA,
        payload: { user },
    };
}
export function clearAuthData() {
    return {
        type: AUTH_CLEAR_USER_DATA,
    };
}
