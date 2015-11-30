var chatUtils = require("utils/chatUtils.js");
var actionTypes = require("constants/actionTypes.js").chat;
var dispatcher = require("dispatcher.js");

module.exports = {

    receiveMessage: function(userId, text, time){
        dispatcher.dispatch({
            type: actionTypes.RECEIVE_MESSAGE,
            userId: userId,
            text: text,
            time: time
        });
    },

    sendMessage: function(text){
        dispatcher.dispatch({
            type: actionTypes.SEND_MESSAGE,
            text: text
        });
    },

    reachBottom: function(){
        dispatcher.dispatch({
            type: actionTypes.REACH_BOTTOM
        });
    },

    startScroll: function(){
        dispatcher.dispatch({
            type: actionTypes.START_SCROLL
        });
    },

    fetchUnread: function(){
        chatUtils.fetchUnread(function(response){
            dispatcher.dispatch({
                type: actionTypes.SET_UNREAD,
                messages: response
            });
        });
    }

};
