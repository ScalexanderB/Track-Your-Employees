// Connect to database
const connection = require('./src/config/config');

// Action functions
const actions = require("./src/lib/actionFunctions");

// Async
const init = async() => {
    console.log('Welcome to your very own employee tracker. To begin, select one of the actions from the list below. If you do not have the required information, leave the section blank and fill it out later.');
    try {
        await actions.start();
    } catch (err) {
        console.log(err);
    }
}

// Call for connection to database and mySQL
connection.connect((err) => {
    if (err) throw err;
    init();
});
