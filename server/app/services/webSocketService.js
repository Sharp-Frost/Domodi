/**
 * Created by Simon on 10/11/15.
 */
var Postal = require('postal');
var channel = Postal.channel();
var io;
var subscription;
var mySocket;

module.exports = function(http) {
    return {

        start: function() {
            console.log('Starting Domodi webSocket service');
            io = require('socket.io').listen(http);
            io.on('connection', function (socket) {
                mySocket = socket;
                console.log("a user connected to websocket");


                mySocket.on('disconnect', function () {
                    console.log('user disconnected');
                });
            });

            //Start listening on message bus (postal) and push data to web client
            //TODO : we should use an array for subscriptions here
            subscription = channel.subscribe( 'profile.changed', function ( data ) {
                mySocket.emit("profile.changed", data); //TODO : optimisation can be done here by sending only relevant informations
                console.log('pushing profile.changed to web client with data :' + data);
            });
        }
    };
}