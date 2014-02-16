/**
 *  Game.js
 *  - contains the whole game logic
 *
 */

    // load config
var config = require(__dirname + '/config/config'),

    //  load other component of the game
    Player = require(__dirname + '/player'),
    Food = require(__dirname + '/food'),
    
    // load custom error
    GameError = require(__dirname + '/game_error'),

    // create the game object
    Game = function (w, h, max) {
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

        
        this.addPlayer = function (id, name) {
            this.players[id] = new Player(id, this.playerCount++, name, this.colors.splice(Math.floor(Math.random() * this.colors.length), 1), ~~((Math.random() * this.w) / 10) * 10, ~~((Math.random() * this.h) / 10) * 10);
        };

        this.spawnFoods = function (broadcaster) {
            broadcaster.emit('spawnFood', new Food(~~((Math.random() * this.w) / 10) * 10, ~~((Math.random() * this.h) / 10) * 10));
        };

    };

module.exports = Game;
