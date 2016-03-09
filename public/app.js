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

var App = React.createClass({
  render: function() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
});
//Form for a user to pick an alias
var AliasPicker = React.createClass({
	enterChat: function(event) {
		event.preventDefault();
		var alias = this.refs.alias.value
    socket.emit('user:enter', alias);
		browserHistory.push('/chat');
	},
	render: function() {
		return (
			<form onSubmit={this.enterChat} className="aliasForm">
				<div className="header"><p>Input an Alias</p></div>
        <div className="description">
          <p>Enter the chatroom by inputting an alias.</p>
        </div>
        <div className="aliasInput">
					<input ref="alias" type="text" id="aliasBox" className="button" placeholder="ALIAS"></input>
					<input type="submit" className="button" value="ENTER" id="enter"></input>
        </div>
			</form>
		);
	}
})

//This component will show all the users who are connected
var UsersList = React.createClass({
	render: function() {
		return (
			<div className="users">
				<h3> Online Users </h3>
				<ul className="usersList">
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

//This component is for any message that is entered from the MessageForm Component
var Message = React.createClass({
	render: function() {
		return (
			<div className="message">
        <strong>{this.props.users}: </strong>
				<span>{this.props.text}</span>
			</div>
		);
	}
});

//This is the component that renders all the messages
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
                users={message.user}
								text={message.text}
							/>
						);
					})
				}
			</div>
		);
	}
});

//This component is form for the user to submit a message
var MessageForm = React.createClass({
	getInitialState() {
		return {
      text: ''
    };
	},
	handleSubmit(event) {
		event.preventDefault();
		var message = {
      user: this.props.user,
			text : this.state.text
		}
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	},
	changeHandler(event) {
		this.setState({ text : event.target.value });
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

//This is the component that holds the whole chat room
var AppChat = React.createClass({
  getInitialState: function() {
    return{
      users: [],
      messages: [],
      text: ''
    }
  },
  componentDidMount: function(){
    var that = this;
    socket.on('initialize', this.initialize);
    socket.on('user:join', this.userJoins);
    socket.on('user:left', this.userLeaves);
    socket.on('send:message', this.receiveMessage);
  },
  initialize: function(data) {
    var users = data.users;
    var name = data.name;
    this.setState({
      users: users,
      user: name
    });
  },
  userJoins: function(data) {
    var users = this.state.users;
    var messages = this.state.messages;
    var name = data.name;
    messages.push({
      user: 'ADMIN',
      text: name + ' has joined the building'
    });
    this.setState({
      users: users,
      messages: messages
    });
  },
  userLeaves: function(data) {
    var users = this.data.users;
    var messages = this.state.messages;
    var name = data.name;
    messages.push({
      user: 'ADMIN',
      text: name + ' has left the building'
    })
    this.setState({
      users: users,
      messages: messages
    });
  },
  receiveMessage: function(message) {
      var messages = this.state.messages;
  		messages.push(message);
  		this.setState({
        messages: messages
      });
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

//This is setup of routes to go from AliasPicker to AppChat
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={AliasPicker}/>
      <Route path="chat" component={AppChat}/>
    </Route>
  </Router>
);


// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
