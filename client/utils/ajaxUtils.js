module.exports = {
    post: function(options){
        var xhr = new XMLHttpRequest();
        var data = JSON.stringify(options.data);

        xhr.open("POST", options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                options.response(JSON.parse(this.responseText));
            }
        }

        xhr.send(data);
    }
};
