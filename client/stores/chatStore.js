var actionTypes = require("constants/actionTypes.js").chat;
var dispatcher = require("dispatcher.js");
var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");

var messages = [];
var isBottomReached = true;

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
    },

    isBottomReached: function(){
        return isBottomReached;
    }

});

store.dispatchToken = dispatcher.register(function(action) {
    switch (action.type) {

        case actionTypes.RECEIVE_MESSAGE:
            messages.push({
                userId: action.userId,
                text: action.text,
                time: action.time
            });
            store.emitChange();
            break;

        case actionTypes.REACH_BOTTOM:
            isBottomReached = true;
            store.emitChange();
            break;

        case actionTypes.START_SCROLL:
            isBottomReached = false;
            store.emitChange();
            break;

        case actionTypes.SET_UNREAD:
            messages = action.messages.concat(messages);
            store.emitChange();
            break;

        default:

    }
});

module.exports = store;
