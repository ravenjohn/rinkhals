/**
 *  Game.js
 *  - contains the whole game logic
 *
 */

    // load config
var config = require(__dirname + '/config/config'),

    //  load other component of the game
    Player = require(__dirname + '/player'),
    
    // load custom error
    GameError = require(__dirname + '/game_error'),

    // create the game object
    Game = function (w, h, max) {
        /** private variables **/
        
        // var broadcaster;
        
        
        /** public variables **/
        
        
        
        // int  map width
        this.w = +w;
        
        // int  map height
        this.h = +h;
        
        // int  max number of players
        this.m = +max;
        
        // int      also used as a channel
        this.id = +new Date();

        // object   holds the game players
        this.players = {};

        // int keeps track of the number of players
        this.playerCount = 0;

        // colors
        this.colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c'];

        
        
        /** public methods **/

        
        
        this.reset = function (broadcaster) {
            var i;
            for ( i in this.players) {
                this.players[i].reset(~~((Math.random() * this.w) / 10) * 10, ~~((Math.random() * this.h) / 10) * 10);
            }
            this.start(broadcaster);
        };
        
        
        this.addPlayer = function (id, name) {
            var player = new Player(id, this.playerCount++, name, this.colors.splice(Math.floor(Math.random() * this.colors.length), 1));

            player.headX = ~~((Math.random() * this.w) / 10) * 10;
            player.headY = ~~((Math.random() * this.h) / 10) * 10;

            // add to the player's list
            this.players[id] = player;

            return player;
        };
        
        this.start = function (broadcaster) {
            var i, temp;
            for (i in this.players) {
                temp = this.players[i];
                temp.interval = setInterval(function (temp, d, players) {
                    var i, j, stopAllIntervals = function (players) {
                        var i;
                        for (i in players)
                            clearInterval(players[i].interval);
                    };
                    
                    switch (temp.orientation) {
                        case 0 : temp.addHead(d, temp.headX - temp.unitSize, temp.headY); break;
                        case 1 : temp.addHead(d, temp.headX, temp.headY - temp.unitSize); break;
                        case 2 : temp.addHead(d, temp.headX + temp.unitSize, temp.headY); break;
                        case 3 : temp.addHead(d, temp.headX, temp.headY + temp.unitSize);
                    }
                    
                    if (temp.selfCollision ) {
                        stopAllIntervals(players);
                        broadcaster.emit('collision', {id : temp.id});
                        return;
                    }
                    
                    for (i in players) {
                        if (players[i].id !== temp.id) {
                            j = players[i].body.length; 
                            while (j--) {
                                if (players[i].headX === temp.headX && players[i].headY === temp.headY) {
                                    stopAllIntervals(players);
                                    broadcaster.emit('collision', {id : 'tie'});
                                    return;
                                } else if (players[i].body[j] === temp.headX + '-' + temp.headY) {
                                    stopAllIntervals(players);
                                    broadcaster.emit('collision', {id : temp.id});
                                    return;
                                }
                            }
                        }
                    }
                    
                    
                    broadcaster.emit('move', temp);
                }, temp.speed, temp, {w : this.w, h : this.h}, this.players);
            }
        };
    };

module.exports = Game;
