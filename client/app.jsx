window.React = require("react");

var ReactDOM = require("react-dom");

var Router = require("react-router").Router;
var Route = require("react-router").Route;
var createBrowserHistory = require("history/lib/createBrowserHistory");

var userActionCreator = require("actions/userActionCreator.js");
var Index = require("components/index.jsx");

userActionCreator.getToken();

ReactDOM.render(
	<Router history={createBrowserHistory()}>
		<Route path="/" component={Index} />
	</Router>,
	document.getElementById("container")
);
