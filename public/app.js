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

var alias;

var App = React.createClass({
  render: function() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
});

var AliasPicker = React.createClass({
	enterChat: function(event) {
		event.preventDefault();
		alias = this.refs.alias.value
		browserHistory.push('/chat');
	},
	render: function() {
		return (
			<div>
				<h1>Input an Alias</h1>
				<form onSubmit={this.enterChat}>
					<input ref="alias" type="text"></input>
					<input type="submit"></input>
				</form>
			</div>
		);
	}
})

var UsersList = React.createClass({
	render() {
		return (
			<div className='users'>
				<h3> Online Users </h3>
				<ul>
					{
						this.props.users.map((user, i) => {
							return (
								<li key={i}>
									{user}
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
});

var Message = React.createClass({
	render: function() {
		return (
			<div className="message">
        <strong>{this.props.user} :</strong>
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
                users={message.users}
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

var AppChat = React.createClass({
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
      <div>
        <UsersList
          users={this.state.users}
        />
        <MessageList
          messages={this.state.messages}
        />
        <MessageForm
          onMessageSubmit={this.handleMessage}
          user={this.state.user}
        />
      </div>
    );
  }
});

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={AliasPicker}/>
      <Route path="chat" component={AppChat}/>
    </Route>
  </Router>
);


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


// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
