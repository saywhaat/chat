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
		userActionCreator.fetchMyInfo();

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
		var myId = userStore.getMyId();
		var myName = userStore.getMyName();

		var messages = _.map(chatStore.getMessages(), function(message){
			var userName = "";
			var isMyMessage = message.userId === myId;

			if(isMyMessage){
				userName = myName;
			}else{
				var user = userStore.getFriendById(message.userId);

				if(user){
					userName = user.name;
				}
			}

			var userNameView = isMyMessage ? <b><i>{userName}: </i></b> : <b>{userName}: </b>;

			return (
				<div>{userNameView}{message.text}</div>
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
