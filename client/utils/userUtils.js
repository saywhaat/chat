var ajaxUtils = require("utils/ajaxUtils.js");
var userStore = require("stores/userStore.js");

module.exports = {

    getToken: function(response){
        ajaxUtils.post({
            url: "/api/getToken",
            response: response
        });
    },

    signIn: function(key, response){
        ajaxUtils.post({
            url: "/api/signIn",
            data: { key: key },
            response: response
        });
    },

    fetchFriends: function(response){
        ajaxUtils.post({
            url: "/api/friends",
            data: { token: userStore.getToken() },
            response: response
        });
    }

};
