var _ = require("lodash");
var userActionCreator = require("actions/userActionCreator.js");

module.exports = React.createClass({

    onInput: _.throttle(function(e){
        userActionCreator.signIn(e.target.value);
    }, 1000),

	render: function(){
		return (
            <input onInput={this.onInput}/>
        );
	}

});
