var actionTypes = require("constants/actionTypes.js").chat;
var dispatcher = require("dispatcher.js");
var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");

var messages = [];

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

    getMessages: function(){
        return messages;
    }

});

store.dispatchToken = dispatcher.register(function(action) {
    switch (action.type) {

        case actionTypes.RECEIVE_MESSAGE:
            messages.push({
                userId: action.userId,
                text: action.text
            });
            store.emitChange();
            break;

        default:

    }
});

module.exports = store;
