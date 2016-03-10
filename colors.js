//This is used to get the colors for the users
var colors = {default: "black"};

function addUser(username, color) {
  colors[username] = color;
}

function getColor(username) {
  if (!colors[username]){
    return colors.default;
  }
  else {
    return colors[username];
  }
}

module.exports = {
  addUser: addUser,
  getColor: getColor,
  colors: colors
}
