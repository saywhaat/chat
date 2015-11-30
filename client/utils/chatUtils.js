var ajaxUtils = require("utils/ajaxUtils.js");
var userStore = require("stores/userStore.js");

module.exports = {

    fetchUnread: function(response){
        ajaxUtils.post({
            url: "/api/unread",
            data: { token: userStore.getToken() },
            response: response
        });
    }

};
