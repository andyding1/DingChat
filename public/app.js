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

var AliasPicker = React.createClass({
	enterChat: function(event) {
		event.preventDefault();
		var alias = this.refs.alias.value
    socket.emit('user:enter', alias);
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
	render: function() {

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
        <strong>{this.props.users}: </strong>
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

var AppChat = React.createClass({
  getInitialState: function() {
    return{
      user: '',
      users: [],
      messages: [],
      text: ''
    }
  },
  setUser(user){
    this.setState({
      user: user
    })
  },
  componentDidMount: function(){
    var that = this;
    socket.on('initialize', this.initialize);
    socket.on('getUser', this.userJoins);
    socket.on('getUserList', this.userJoins);
    socket.on('user:left', this.userLeaves);
    socket.on('send:message', this.receiveMessage);
  },
  initialize: function(data) {
    var users = data.users;
    var name = data.name;
    this.setState({
      users: users,
      name: name,
      user: data.user
    });
  },
  userJoins: function(data) {
    console.log(data);
    if(data.name){
      var messages = this.state.messages;
      var name = data.name;
      messages.push({
        text: data.name + ' has joined the building'
      });
      this.setState({
        user: name,
        messages: messages
      })
    }
    if(data.users){
      var users = data.users;
      this.setState({
        users: users
      })
    }
  },
  userLeaves: function(data) {
    var users = this.state.users;
    var messages = this.state.messages;
    var name = data.name;
    users.splice(users.indexOf(name),1);
    messages.push({
      text: name + 'has left the building'
    });
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
