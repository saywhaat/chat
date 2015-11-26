var userStore = require("stores/userStore.js");
var SignIn = require("components/signIn.jsx");
var Chat = require("components/chat.jsx");

module.exports = React.createClass({

	_onChange: function(){
		this.forceUpdate();
	},

	componentDidMount: function() {
		userStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		userStore.removeChangeListener(this._onChange);
	},

	render: function(){
        var layout;
        var token = userStore.getToken();

        if(typeof token === "undefined"){
            layout = <span>Loading...</span>;
        }else if(token === null){
            layout = <SignIn/>;
        }else{
            layout = <Chat/>;
        }

		return layout;
	}

});
