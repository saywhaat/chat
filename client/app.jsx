var React = require("react");
var ReactDOM = require("react-dom");

var Router = require("react-router").Router;
var Route = require("react-router").Route;

var Index = React.createClass({
	render: function(){
		return <h1>Hello</h1>
	}
});

ReactDOM.render(
	<Router>
		<Route path="/" component={Index} />
	</Router>,
	document.getElementById("container")
);
