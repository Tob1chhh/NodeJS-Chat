const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
app.set('view engine', 'ejs');

module.exports = app;
const PORT = 3000;
const server = app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`);
});
const io = require('socket.io')(server);

let socketsConnected = new Set();
io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients_total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
        socketsConnected.delete(socket.id);
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', {
            message: data.message,
            username: data.username,
        });
    });
};

const user = { 
    username: '', 
    email: '', 
    password: '', 
    status: 'Offline' ,
};

const createPath = (page) => path.resolve(__dirname, 'ejs-html', `${page}.ejs`);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false}));

app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('src'));

app.post('/', (req, res) => {
    const { username, email, password } = req.body;
    user.username = username;
    user.email = email;
    user.password = password;

    res.render(createPath('chatwindow'), { user } );
});

app.get('/', (req, res) => {
    res.render(createPath('startwindow'));
});
app.get('/users', (req, res) => {
    res.render(createPath('userswindow'), { user });
});
app.get('/settings', (req, res) => {
    res.render(createPath('settingswindow'));
});
app.use((req, res, next) => {
    res.status(404);
    res.render(createPath('error'));
    next();
});