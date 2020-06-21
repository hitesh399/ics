import React from 'react';

export function dateTimeFormat(date) {
    return date ? new Date(date).toLocaleString('en-in') : 'N.a';
}
export function isValidUrl(url) {
    const pattern = new RegExp('^(https?|ftp)://');
    return pattern.test(url);
}
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
export function getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function guidGenerator() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
export function getTimeOffset() {
    let userTimeZone = new Date().getTimezoneOffset();
    const sign = userTimeZone <= 0 ? '+' : '-';
    userTimeZone = Math.abs(userTimeZone);
    const modulus = userTimeZone % 60;
    const absoluteNumber = parseInt(userTimeZone / 60);
    return sign + pad(absoluteNumber, 2) + (modulus ? ':' + pad(modulus, 2) : ':00');
}

export function pad(value, size) {
    let s = value.toString();
    while (s.length < (size || 2)) {
        s = '0' + s;
    }
    return s;
}

export function convertObjectToQueryString(obj, prefix) {
    let str = [];

    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + '[' + p + ']' : p,
                v = obj[p];
            str.push(
                v !== null && typeof v === 'object'
                    ? convertObjectToQueryString(v, k)
                    : encodeURIComponent(k) + '=' + encodeURIComponent(v ? v : ''),
            );
        }
    }
    return str.join('&');
}

export const renderDyamicComponent = (dyamicComponent, props) => {
    if (typeof dyamicComponent === 'function') {
        return React.createElement(dyamicComponent, props);
    } else if (
        typeof dyamicComponent === 'object' &&
        typeof dyamicComponent.render === 'function'
    ) {
        return dyamicComponent.render({
            ...props,
            ...dyamicComponent.defaultProps,
        });
    }
    return dyamicComponent;
};
