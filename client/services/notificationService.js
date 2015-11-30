var chatActionTypes = require("constants/actionTypes.js").chat;
var dispatcher = require("dispatcher.js");
var userStore = require("stores/userStore.js");

var service = {};
var notification;
var timeoutId;

function showNotification(text){
    timeoutId && clearTimeout(timeoutId);

    notification && notification.close();
    notification = new Notification(text);

    timeoutId = setTimeout(function(){
        notification.close();
        notification = null;
    }, 2000);
}

service.dispatchToken = dispatcher.register(function(action) {
    switch (action.type) {

        case chatActionTypes.RECEIVE_MESSAGE:
            if(userStore.getMyId() !== action.userId){
                var name = userStore.getFriendById(action.userId).name;
                var text = name + ": " + action.text;

                if (Notification.permission === "granted") {
                    showNotification(text);
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if (permission === "granted") {
                            showNotification(text);
                        }
                    });
                }
            }

            break;

        default:

    }
});

module.exports = service;
