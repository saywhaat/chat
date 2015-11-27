var actionTypes = require("constants/actionTypes.js").chat;
var dispatcher = require("dispatcher.js");

module.exports = {

    receiveMessage: function(userId, text){
        dispatcher.dispatch({
            type: actionTypes.RECEIVE_MESSAGE,
            userId: userId,
            text: text
        });
    }

};
