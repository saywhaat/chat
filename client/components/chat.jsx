var port = location.hostname === "localhost" ? "8081" : "8000";

var chatActionCreator = require("actions/chatActionCreator.js");
var chatStore = require("stores/chatStore.js");
var userStore = require("stores/userStore.js");
var _ = require("lodash");

module.exports = React.createClass({

	getInitialState: function() {
		return {text: ""};
	},

	_onChange: function(){
		this.forceUpdate();
	},

	messageChange: function(e){
		this.setState({text: e.target.value});
	},

	sendMessage: function(){
		this.setState({text: ""});
		this.connection.send(JSON.stringify({
			token: userStore.getToken(),
			text: this.state.text
		}));
	},

	componentDidMount: function() {
		chatStore.addChangeListener(this._onChange);

		var connection = this.connection = new WebSocket("ws://" + window.location.hostname + ":" + port);

		connection.onmessage = function (message) {
			var data = JSON.parse(message.data);

			chatActionCreator.receiveMessage(data.userId, data.text);
		};
	},

	componentWillUnmount: function() {
		chatStore.removeChangeListener(this._onChange);
	},

	render: function(){
		var messages = _.map(chatStore.getMessages(), function(message){
			return (
				<div><span>{message.userId}: {message.text}</span></div>
			);
		});

		return (
			<div>
	            <h1>Chat</h1>
				{messages}
				<textarea value={this.state.text} onChange={this.messageChange}></textarea>
				<p/>
				<button onClick={this.sendMessage}>Go</button>
			</div>
        );
	}
});
