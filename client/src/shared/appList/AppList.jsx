import React, { createContext, useReducer, useCallback, useState } from 'react';
import {
    setListData,
    changeListRequestStatus,
    setListServerStatus,
    pushListData,
    listAddSelectedRows,
} from './app-list-action';
import axios from 'axios';
import { get } from 'lodash';
import { Formik } from 'formik';
import isEqual from 'react-fast-compare';
import { appListReducer } from './app-list-reducer';
import { AppListConfig } from './config';

/**
 * To check the given value is empty object
 *
 * @param {any} any value
 *
 * @returns { boolean }
 */
const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * To convert the object into query string
 *
 * @param {*} obj - object
 * @param {*} prefix - key prefix
 *
 * @returns {string}
 */
function convertObjectToQueryString(obj, prefix) {
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

export const AppListContext = createContext();

export const AppList = ({
    name,
    children,
    action,
    method = AppListConfig.method,
    fetchOnLoad = AppListConfig.fetchOnLoad,
    autoFilter = AppListConfig.autoFilter,
    keepAlive = AppListConfig.keepAlive,
    dataKey = AppListConfig.dataKey,
    totalKey = AppListConfig.totalKey,
    infoKey = AppListConfig.infoKey,
    perPageSize = AppListConfig.perPageSize,
    pageKeyName = AppListConfig.pageKeyName,
    primaryKeyName = AppListConfig.primaryKeyName,
    initialValues = {},
    paginationType = 'pagination', // PropTypes.oneOf(['pagination', 'loadMore']),
    multiSorting = false,
    modifyPayload,
    ...props // Formik props
}) => {
    const initValues = useCallback(() => {
        let storedData = keepAlive ? window.localStorage.getItem('APP_LIST_' + name) : null;
        storedData = storedData ? JSON.parse(storedData) : initialValues;
        return storedData ? storedData : {};
    }, [name, initialValues, keepAlive]);
    const _initValues = initValues();

    const [state, dispatch] = useReducer(appListReducer, {
        meta: {
            currentPage: get(_initValues, 'APP_LIST_PAGE', 1),
            primaryKey: primaryKeyName,
            total: 0,
        },
        data: [],
        info: {},
        requesting: false,
        status: null,
        error: null,
        shouldUpdate: true,
        lastUpdatedAt: null,
        selected: [],
    });

    const listState = {
        data: state.data,
        selected: state.selected,
        info: state.info,
        requesting: state.requesting,
        shouldUpdate: state.shouldUpdate,
        lastUpdatedAt: state.lastUpdatedAt,
        total: state.meta.total,
        currentPage: state.meta.currentPage,
        primaryKey: state.meta.primaryKey,
    };

    const reduxThunk = (action) => {
        if (typeof action === 'function') {
            return action(dispatch, () => state);
        }
        return dispatch(action);
    };

    // console.log('props', props);
    const [fetchCount, setFetchCount] = useState(0);

    return (
        <Formik
            initialValues={_initValues}
            {...props}
            onSubmit={(values, formikBag) => {
                formikBag.setSubmitting(true);
                setFetchCount(fetchCount + 1);
            }}>
            {(formikProps) => (
                <form onSubmit={formikProps.handleSubmit}>
                    <AppListProvider
                        name={name}
                        action={action}
                        method={method}
                        fetchCount={fetchCount}
                        fetchOnLoad={fetchOnLoad}
                        initialValues={_initValues}
                        modifyPayload={modifyPayload}
                        autoFilter={autoFilter}
                        keepAlive={keepAlive}
                        dataKey={dataKey}
                        totalKey={totalKey}
                        infoKey={infoKey}
                        multiSorting={multiSorting}
                        paginationType={paginationType}
                        perPageSize={perPageSize}
                        pageKeyName={pageKeyName}
                        {...formikProps}
                        {...listState}
                        dispatch={reduxThunk}>
                        {children}
                    </AppListProvider>
                </form>
            )}
        </Formik>
    );
};

export class AppListProvider extends React.PureComponent {
    _axiosSource = null;

    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.changePage = this.changePage.bind(this);
        this.refresh = this.refresh.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.filter = this.filter.bind(this);
    }

    /**
     * To get the total page in list
     */
    getTotalPage() {
        const { total, perPageSize } = this.props;
        return total && perPageSize ? Math.ceil(total / perPageSize) : 0;
    }
    /**
     * If any change comes in filter fields then this function should call.
     * the function everytime fetch the first page data.
     *
     * @returns { Promise } - return a promise instance with contains the server data.
     */
    filter() {
        this.props.dispatch(listAddSelectedRows([]));
        return this.fetchData(1);
    }
    /**
     * To prepare the request payload
     *
     * @param {Numner} page - Upcoming page number
     *
     * @returns { Object } - payload
     */
    getPayload(page = 1) {
        const { values, pageKeyName, modifyPayload } = this.props;
        delete values.APP_LIST_PAGE;
        const clonedPayload = values ? JSON.parse(JSON.stringify(values)) : {};
        clonedPayload[pageKeyName] = page;
        return typeof modifyPayload === 'function' ? modifyPayload(clonedPayload) : clonedPayload;
    }
    /**
     * To send the request on server with payload.
     *
     * @param {Number} page -   upcoming page numnber to get the data
     *
     * @returns { Promise } - return a promise instance with contains the server data.
     */
    async fetchData(page = 1) {
        const {
            dispatch,
            method,
            action,
            dataKey,
            totalKey,
            infoKey,
            paginationType,
            setSubmitting,
        } = this.props;

        const payload = this.getPayload(page);
        /**
         * this function uses to make list busy before requesting to server
         */
        const busy = () => {
            setSubmitting(true);
            dispatch(changeListRequestStatus(true));
        };
        /**
         * This closure function uses to set the list data
         *
         * @param { Object } data - Data to set in list
         * @param { Number } total -  total data count
         * @param { Object } info  - other data which does not relate to list.
         */
        const setData = (data, total, info) => {
            if (paginationType === 'pagination' || page === 1) {
                dispatch(setListData(data, page, total, info));
            } else {
                dispatch(pushListData(data, page, total, info));
            }
            setSubmitting(false);
            dispatch(setListServerStatus('success'));
        };
        /**
         * This closure function uses to set the server error
         *
         * @param { Object } error - Server error Object.
         */
        const setError = (error) => {
            if (paginationType === 'pagination') {
                dispatch(setListData([], page, 0, {}));
            }
            setSubmitting(false);
            dispatch(setListServerStatus('fail', error));
        };

        if (typeof action === 'function') {
            return action({
                payload,
                busy,
                setData,
                setError,
            });
        }

        const oldAxiosSource = this._axiosSource;
        const CancelToken = axios.CancelToken;
        this._axiosSource = CancelToken.source();
        /**
         * Cancel Old Request source
         */
        if (oldAxiosSource) {
            oldAxiosSource.cancel('overlapping');
            oldAxiosSource.token.promise.then((error) => {
                return Promise.resolve(error);
            });
        }
        busy();
        const config = {
            cancelToken: this._axiosSource.token,
            method: method,
            url: action,
        };

        if (method.toString().toLowerCase() === 'get') {
            config.url = action + '?' + convertObjectToQueryString(payload);
        } else {
            config.data = payload;
        }

        return AppListConfig.axios(config)
            .then((response) => {
                const data = get(response, `data.${dataKey}`);
                const total = get(response, `data.${totalKey}`);
                const info = get(response, `data.${infoKey}`);
                setData(data, total, info);
                this._axiosSource = null;
                return response;
            })
            .catch((error) => {
                if (error.message !== 'overlapping') {
                    setError(error);
                    this._axiosSource = null;
                }
                return Promise.reject(error);
            });
    }

    /**
     * To get the given page data.
     *
     * @param {Number} page - desire page numnber to get the data
     *
     * @returns {Promise | Error} - return a promise instance with contains the server data.
     */
    changePage(page, force = false) {
        if (page <= this.getTotalPage() || force) {
            return this.fetchData(page);
        } else {
            console.log('Done danna dan 3');

            return new Error('Page Not Available');
        }
    }
    /**
     * To Clear the selected Value
     *
     * @retrun {void}
     */
    clearSelected() {
        this.props.dispatch(listAddSelectedRows(this.props.name, []));
    }
    /**
     * To get the next page data if available.
     *
     * @returns {Promise | Error} -  - return a promise instance with contains the server data or void.
     */
    next() {
        return this.changePage(this.props.currentPage + 1);
    }
    /**
     * To get the prev page data if available.
     *
     * @returns {Promise | Error} -  - return a promise instance with contains the server data or void.
     */
    prev() {
        return this.changePage(this.props.currentPage - 1);
    }

    /**
     * To refresh the current page data.
     *
     * @returns {Promise} - return a promise instance with contains the server data.
     */
    refresh() {
        return this.props.paginationType === 'loadMore'
            ? this.filter()
            : this.changePage(this.props.currentPage, true);
    }
    componentDidMount() {
        const { fetchOnLoad, keepAlive, values, currentPage } = this.props;
        /**
         * Request to server to fetch the data , if fetchOnLoad= true
         */
        if (fetchOnLoad || (keepAlive && values && isEmptyObject(values))) {
            this.fetchData(currentPage).catch();
        }
    }
    componentDidUpdate(prevProps) {
        const {
            name,
            keepAlive,
            values,
            currentPage,
            paginationType,
            fetchCount,
            autoFilter,
        } = this.props;

        const isEqualPayload = isEqual(prevProps.values, values);
        const shouldSaveOnPageChange =
            currentPage !== prevProps.currentPage && paginationType === 'pagination';
        /**
         * Save payload on local storage if make any change and keepAlive=true
         */
        if (keepAlive && (!isEqualPayload || shouldSaveOnPageChange)) {
            setTimeout(() => {
                const payload = {
                    ...values,
                    ...(shouldSaveOnPageChange ? { APP_LIST_PAGE: currentPage } : {}),
                };
                window.localStorage.setItem('APP_LIST_' + name, JSON.stringify(payload));
            }, 0);
        }
        /**
         * Request to fetch the data.
         */
        if (fetchCount !== prevProps.fetchCount || (autoFilter && !isEqualPayload)) {
            setTimeout(() => {
                this.filter();
            }, 0);
        }
    }

    render() {
        const {
            data,
            name,
            primaryKey,
            perPageSize,
            info,
            selected,
            requesting,
            shouldUpdate,
            lastUpdatedAt,
            total,
            currentPage,
            handleSubmit,
            resetForm,
            values,
            children,
            dispatch,
            multiSorting,
        } = this.props;
        return (
            <AppListContext.Provider
                value={{
                    next: this.next,
                    prev: this.prev,
                    changePage: this.changePage,
                    refresh: this.refresh,
                    clearSelected: this.clearSelected.bind(this),
                    pages: this.getTotalPage(),
                    data,
                    name,
                    primaryKey,
                    perPageSize,
                    info,
                    selected,
                    requesting,
                    shouldUpdate,
                    lastUpdatedAt,
                    total,
                    currentPage,
                    handleSubmit,
                    resetForm,
                    values,
                    dispatch,
                    multiSorting,
                }}>
                {children}
            </AppListContext.Provider>
        );
    }
}
