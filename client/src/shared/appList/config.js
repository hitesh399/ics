export const AppListConfig = {
    options: {
        method: 'get',
        fetchOnLoad: true,
        autoFilter: true,
        keepAlive: false,
        dataKey: 'results',
        totalKey: 'info.count',
        infoKey: 'info',
        perPageSize: 20,
        pageKeyName: 'page',
        primaryKeyName: 'id',
        axios: null,
    },
    get method() {
        return this.options.method;
    },
    get fetchOnLoad() {
        return this.options.fetchOnLoad;
    },
    get autoFilter() {
        return this.options.autoFilter;
    },
    get keepAlive() {
        return this.options.keepAlive;
    },
    get dataKey() {
        return this.options.dataKey;
    },
    get totalKey() {
        return this.options.totalKey;
    },
    get infoKey() {
        return this.options.infoKey;
    },
    get perPageSize() {
        return this.options.perPageSize;
    },
    get pageKeyName() {
        return this.options.pageKeyName;
    },
    get primaryKeyName() {
        return this.options.primaryKeyName;
    },
    get axios() {
        return this.options.axios;
    },
    merge: function (options) {
        this.options = Object.assign({}, this.options, this.extractOptions(options));
    },
    extractOptions(attrs) {
        const optionKeys = Object.keys(this.options);
        let data = {};
        optionKeys.forEach((k) => {
            const val = attrs[k];
            if (val !== undefined) {
                data[k] = val;
            }
        });
        return data;
    },
};
