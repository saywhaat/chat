var chatActionCreator = require("actions/chatActionCreator.js");
var userActionCreator = require("actions/userActionCreator.js");
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

	handleTextAreaKeyPress: function(e){
		if(e.which === 13){
			e.preventDefault();
			chatActionCreator.sendMessage(this.state.text);
			this.setState({text: ""});
		}
	},

	componentDidMount: function() {
		chatStore.addChangeListener(this._onChange);
		userActionCreator.fetchFriends();
		chatActionCreator.fetchUnread();

		window.onscroll = function() {
			if($(window).scrollTop() + $(window).height() === $(document).height()) {
				chatActionCreator.reachBottom();
			}else if(chatStore.isBottomReached()){
				chatActionCreator.startScroll();
			}
		}
	},

	componentWillUnmount: function() {
		chatStore.removeChangeListener(this._onChange);
	},

	componentDidUpdate: function(){
		if(chatStore.isBottomReached()){
			setTimeout(function(){
				window.scrollTo(0, document.body.scrollHeight);
			}, 0);
		}
	},

	render: function(){
		var friends = userStore.getFriends();

		var messages = _.map(chatStore.getMessages(), function(message){
			var user = _.find(friends, { id: message.userId });
			var userName = user ? user.name : "";

			return (
				<div><b>{userName}: </b>{message.text}</div>
			);
		});

		return (
			<div>
				{messages}
				<textarea value={this.state.text} onChange={this.messageChange} onKeyPress={this.handleTextAreaKeyPress}></textarea>
			</div>
        );
	}
});
