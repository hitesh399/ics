export const SIDEBAR_STATUS = 'SIDEBAR_STATUS';

export function changeSidebarStatus(status) {
    return {
        type: SIDEBAR_STATUS,
        payload: { status },
    };
}
