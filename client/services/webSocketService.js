var port = location.hostname === "localhost" ? "8081" : "8000";

var chatActionTypes = require("constants/actionTypes.js").chat;
var userActionTypes = require("constants/actionTypes.js").user;
var messageTypes = require("constants/messageTypes.js");

var dispatcher = require("dispatcher.js");
var chatActionCreator = require("actions/chatActionCreator.js");
var userStore = require("stores/userStore.js");

function onMessage(message){
    var data = JSON.parse(message.data);

    switch(data.type){
        case messageTypes.RECEIVE:

            chatActionCreator.receiveMessage(data.userId, data.text, data.time);

            break;
    }
}

var service = {};

var connection = null;

service.dispatchToken = dispatcher.register(function(action) {
    switch (action.type) {

        case userActionTypes.SET_TOKEN:
            if(action.token){
                connection = new WebSocket("ws://" + window.location.hostname + ":" + port);
                connection.onmessage = onMessage;
            }

            break;

        case chatActionTypes.SEND_MESSAGE:

            connection.send(JSON.stringify({
                type: messageTypes.SEND,
                text: action.text,
                token: userStore.getToken()
            }));

            break;

        case chatActionTypes.REACH_BOTTOM:

            connection.send(JSON.stringify({
                type: messageTypes.MARK_ALL_READ,
                token: userStore.getToken()
            }));

            break;

        default:

    }
});

module.exports = service;
