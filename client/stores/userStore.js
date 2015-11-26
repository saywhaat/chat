var actionTypes = require("constants/actionTypes.js").user;
var dispatcher = require("dispatcher.js");
var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");

var token;

var store = _.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit("change");
    },

    addChangeListener: function(callback) {
        this.on("change", callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener("change", callback);
    },

    getToken: function(){
        return token;
    }

});

store.dispatchToken = dispatcher.register(function(action) {
    switch (action.type) {

        case actionTypes.SET_TOKEN:
            token = action.token;
            store.emitChange();
            break;

        default:

    }
});

module.exports = store;
