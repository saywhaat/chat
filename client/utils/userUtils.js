var ajaxUtils = require("utils/ajaxUtils.js");

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
    }

};
