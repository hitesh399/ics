const _EventManager = function () {
    this.initialize();
};
_EventManager.prototype = {
    initialize: function () {
        //declare listeners as an object
        this.listeners = {};
    },
    // public methods
    on: function (event, fn) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        if (fn instanceof Function) {
            this.listeners[event].push(fn);
        }
        return this;
    },
    dispatch: function (event, params) {
        // loop through listeners array
        const output = [];
        for (let index = 0, l = this.listeners[event].length; index < l; index++) {
            // execute matching 'event' - loop through all indices and
            // when ev is found, execute
            output.push(this.listeners[event][index].call(window, params));
        }
        return output;
    },
    off: function (event, fn) {
        // split array 1 item after our listener
        // shorten to remove it
        // join the two arrays back together
        if (this.listeners[event]) {
            this.listeners[event].every((listner, i) => {
                // console.log('listnerlistner', fn, listner)
                if (listner === fn) {
                    this.listeners[event].slice(i, 1);
                    return false;
                }
                return true;
            });
        }
    },
};

export const EventManager = new _EventManager();
