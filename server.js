var connect = require('connect'),
    app = require('http').createServer(connect().use(connect.static(__dirname + '/public'))),
    io = require('socket.io').listen(app),
    config = require(__dirname + '/lib/config/config'),
    Game = require(__dirname + '/lib/game'),
    getGameBySocketId = function (id) {
        var i;
        for (i in games) {
            if (games[i].players[id]) {
                return games[i];
            }
        }
        return false;
    },
    games = {};

io.set('browser client minification', true);
io.set('browser client gzip', true);
io.set('log level', 0);

io.sockets.on('connection', function (socket) {

    socket.on('new', function (data) {
        var game, player, temp;

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
                io.sockets.in(game.id).emit('setup game', game);

                console.log('max', game.m);
                
                if (game.m === game.playerCount) {
                    game.start(io.sockets.in(game.id));
                }
            }
        } else {
            console.log('1st player');
            game = new Game(data.w, data.h, data.m);
            player = game.addPlayer(socket.id, data.name);

            socket.emit('id', {id : game.id});

            socket.join(game.id);
            io.sockets.in(game.id).emit('setup game', game);
            games[game.id] = game;
        }
    });

    socket.on('move', function (data) {
        var game;
        if (game = getGameBySocketId(socket.id)) {
            game.players[socket.id].orientation = data.orientation;
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
            }
        }
    });
    
    socket.on('restart', function () {
        var game;
        if (game = getGameBySocketId(socket.id)) {
            game.reset(io.sockets.in(game.id));
        }
    });

    if (process.env.NODE_ENV === 'debug') {
        socket.on('kill', function () {
            process.exit(0);
        });
    }

});


app.listen(config.port);
console.log('Socket started on port ' + config.port);
