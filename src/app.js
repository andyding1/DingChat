var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

var io = require('socket.io-client');

var socket = io.connect();

var Message = React.createClass({
	render: function() {
		return (
			<div className="message">
				<span>{this.props.text}</span>
			</div>
		);
	}
});

var MessageList = React.createClass({
	render: function() {
		return (
			<div className='messages'>
				<h2> MessageList: </h2>
				{
					this.props.messages.map((message, i) => {
						return (
							<Message
								key={i}
								text={message.text}
							/>
						);
					})
				}
			</div>
		);
	}
});

var MessageForm = React.createClass({
	getInitialState() {
		return {text: ''};
	},
	handleSubmit(e) {
		e.preventDefault();
		var message = {
			text : this.state.text
		}
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	},

	changeHandler(e) {
		this.setState({ text : e.target.value });
	},

	render: function() {
		return(
			<div className='message_form'>
				<h3>Input Message</h3>
				<form onSubmit={this.handleSubmit}>
					<input
						onChange={this.changeHandler}
						value={this.state.text}
					/>
          <input type="submit"></input>
				</form>
			</div>
		);
	}
});

var App = React.createClass({
  getInitialState: function() {
    return{
      messages: [],
      text: ''
    }
  },
  componentDidMount: function(){
    socket.on('send:message', this.receiveMessage);
  },
  receiveMessage: function(message) {
      console.log(this.state);
      var {messages} = this.state;
  		messages.push(message);
  		this.setState({messages});
  },
  handleMessage: function(message) {
    socket.emit('send:message', message);
  },
  render: function() {
    return (
      <main>
        <MessageList
          messages={this.state.messages}
        />
        <MessageForm
          onMessageSubmit={this.handleMessage}
          user={this.state.user}
        />
      </main>
    );
  }
});

// // home "page"
// var Home = React.createClass({
//   render: function() {
//     return (
//       <div>
//         <h3>Welcome!</h3>
//       </div>
//     );
//   }
// });

// var routes = (
//   <Router history={browserHistory}>
//     <Route path="/" component={App}>
//       <IndexRoute component={Home}/>
//     </Route>
//   </Router>
// );

// If this line of code is not here, nothing gets displayed!
ReactDOM.render(<App/>, document.querySelector('#app'));
