import { setCookie, getCookie, deleteCookie } from '../app-utils';

describe('Test, app utils', () => {
    it('TEST_COOKIE_FUNCTION', () => {
        setCookie('test_key', 'test_value', 1);
        expect(getCookie('test_key')).toBe('test_value');
        deleteCookie('test_key');
        expect(getCookie('test_key')).toBe('');
    });
});
