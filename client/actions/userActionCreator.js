var userUtils = require("utils/userUtils.js");
var actionTypes = require("constants/actionTypes.js").user;
var dispatcher = require("dispatcher.js");

function setToken(token){
    dispatcher.dispatch({
        type: actionTypes.SET_TOKEN,
        token: token
    });
}

module.exports = {

    getToken: function(){
        userUtils.getToken(function(response){
            setToken(response.token);
        });
    },

    signIn: function(key){
        userUtils.signIn(key, function(response){
            if(response.token){
                setToken(response.token);
            }
        });
    },

    fetchFriends: function(){
        userUtils.fetchFriends(function(response){
            dispatcher.dispatch({
                type: actionTypes.SET_FRIENDS,
                friends: response
            });
        });
    },

    fetchMyInfo: function(){
        userUtils.fetchMyInfo(function(response){
            dispatcher.dispatch({
                type: actionTypes.SET_MY_INFO,
                name: response.name,
                id: response.id
            });
        });
    }

};
