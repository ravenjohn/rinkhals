/*jslint node: true */
"use strict";

var config = require(__dirname + '/lib/config/config'),
    Game = require(__dirname + '/lib/game'),
    io = require('socket.io').listen(config.port),
    games = [],
    getGameBySocketId = function (id) {
        var i;
        for (i in games) {
            if (games[i].players[id]) {
                return games[i];
            }
        }
        return false;
    };

io.set('log level', 0);

io.sockets.on('connection', function (socket) {

    socket.on('new', function (data) {
        var game, player, temp;
        console.log("new", data);
        if (game = getGameBySocketId(socket.id)) {
            socket.emit('warning', {message : "You are already part of a game. duh"});
        } else if (game = games[data.id]) {
            if (game.playerCount === config.maxPlayers) {
                socket.emit('warning', {message : 'Game full'});
            } else if (game.gameStarted) {
                socket.emit('warning', {message : 'Game already started'});
            } else {
                console.log('another player');
                player = game.addPlayer(socket.id, data.name);

                socket.join(game.id);
                console.dir(game);
                io.sockets.in(game.id).emit('setup game', game);
                
                setInterval(function () {
                    io.sockets.in(game.id).emit('move', game.players);
                }, 500);
            }
        } else {
            console.log('1st player');
            game = new Game(data.w, data.h);
            player = game.addPlayer(socket.id, data.name);

            socket.emit('id', {id : game.id});
            
            socket.join(game.id);
            io.sockets.in(game.id).emit('setup game', game);
            games[game.id] = game;
        }
    });
    
    socket.on('move', function (data) {
        var game;
        console.log('someone moved');
        if (game = getGameBySocketId(socket.id)) {
            game.move(data, socket.id);
            console.log(game.players[socket.id].orientation);
            //io.sockets.in(game.id).emit('move', {orientation : data.orientation, id : socket.id});
        } else {
            socket.emit("warning", {message : "Unable to find your game"});
        }
    });

    socket.on('disconnect', function () {
        console.log('client disconnected');
        var rooms = io.sockets.manager.roomClients[socket.id],
            room;

        for (room in rooms) {
            if (room && rooms[room]) {
                room = room.replace('/', '');
                io.sockets.in(room).emit('warning', {message : games[room].players[socket.id].name + ' has been disconnected.'});
                socket.leave(room);
                // delete games[room];
            }
        }
    });
    
    if (config.mode === 'debug') {
        socket.on('kill', function () {
            process.exit(0);
        }):
    }

});
