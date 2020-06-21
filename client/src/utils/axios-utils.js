import axios from 'axios';
import { getCookie } from './app-utils';

const service = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

service.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
service.defaults.headers.common['Content-Type'] = 'application/json';
// service.defaults.headers.common['x-provider-name'] = process.env.REACT_APP_X_PROVIDER_NAME;
service.interceptors.request.use((config) => {
    const authToken = getCookie('ACCESS-TOKEN');
    if (authToken) {
        config.headers['Authorization'] = 'Bearer ' + authToken;
    }

    return config;
});

service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const request = service;
