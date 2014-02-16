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
        var game;

        if (game = getGameBySocketId(socket.id)) {
            socket.emit('warning', {message : "You are already part of a game. duh"});
        } else if (game = games[data.id]) {
            if (game.playerCount === game.m) {
                socket.emit('warning', {message : 'Game full'});
            } else if (game.gameStarted) {
                socket.emit('warning', {message : 'Game already started'});
            } else {
                console.log('another player');

                game.addPlayer(socket.id, data.name);
                socket.join(game.id);

                if (game.m === game.playerCount) {
                    io.sockets.in(game.id).emit('setup game', game);
                    io.sockets.in(game.id).emit('start');
                    game.foodInterval = setInterval(function () {
                        game.spawnFoods(io.sockets.in(game.id));
                    }, 5000);
                }
            }
        } else {
            console.log('1st player');
            game = new Game(data.w, data.h, data.m);
            game.addPlayer(socket.id, data.name);

            socket.emit('id', {id : game.id});
            socket.join(game.id);

            games[game.id] = game;
        }
    });

    socket.on('move', function (data) {
        io.sockets.in(data.gameId).emit('move', data);
    });
    
    socket.on('restart', function () {
        var game;
        if (game = getGameBySocketId(socket.id)) {
            io.sockets.in(game.id).emit('setup game', game);
            io.sockets.in(game.id).emit('start');
        }
    });
    
    socket.on('disconnect', function () {
        var game;
        if (game = getGameBySocketId(socket.id)){
            socket.leave(game.id);
            if (--game.playerCount === 0) {
                clearInterval(game.foodInterval);
                delete games[game.id];
            }
        }
        socket.disconnect();
    });

});


app.listen(config.port);
console.log('Socket started on port ' + config.port);
