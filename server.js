
//Start with npm init {} Download express and ejs {} And write the first four lines just as it is {} Also don't forget the server.listen() to listen to the project {}

const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid'); // Import the v4 function explicitly
const io = require('socket.io')(server);    //Syntax for adding socket.io in the file
const { ExpressPeerServer } = require('peer');      //Importing peerserver in the project to enable WebDtc to communicate
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);     //Initializing an URL for peerServer

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);  //In order for the user to join the room
        socket.broadcast.to(roomId).emit('user-connected', userId);     //Broadcasting or telling that the user has entered the room
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message);
        })

    })
})




server.listen(3030);
        //To listen to the server with the required port number for the local host [Here 3030]