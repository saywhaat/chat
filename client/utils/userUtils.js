var ajaxUtils = require("utils/ajaxUtils.js");

module.exports = {

    fetchToken: function(response){
        ajaxUtils.post({
            url: "/api/fetchToken",
            response: response
        });
    },

    signIn: function(key, response){
        ajaxUtils.post({
            url: "/api/signIn",
            data: { key: key },
            response: response
        });
    }

};
