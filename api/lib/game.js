/*jslint node: true */
"use strict";

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
    Game = function (w, h) {

        
        
        /** public variables **/
        
        
        
        // int  map width
        this.w = +w;
        
        // int  map height
        this.h = +h;
        
        // int      also used as a channel
        this.id = +new Date();

        // object   holds the game players
        this.players = {};

        // int      keeps track of the number of players
        this.playerCount = 0;
        
        
        
        /** public methods **/

        
        
        this.addPlayer = function (id, name) {
            var player = new Player(id, this.playerCount++, name);

            player.headX = ~~((Math.random() * this.w) / 10) * 10;
            player.headY = ~~((Math.random() * this.h) / 10) * 10;

            // add to the player's list
            this.players[id] = player;
            
            return player;
        };
        
        this.addHead = function (x, y) {
                x = x % this.w;
                y = y % this.h;
                x < 0 && (x = this.w - x);
                y < 0 && (y = this.h - y);
                this.body.length > 5 && this.body.pop();
                this.headX = x;
                this.headY = y;
                this.body.unshift(x + '' + y);
        };
        
        this.move = function (data, id) {
            var temp;
            if (data.orientation) {
                temp = this.players[id];
                temp.orientation = data.orientation;
                switch (te.orientation) {
                    case 0 : temp.addHead(temp.headX - temp.unitSize, temp.headY); break;
                    case 1 : temp.addHead(temp.headX, temp.headY - temp.unitSize); break;
                    case 2 : temp.addHead(temp.headX + temp.unitSize, temp.headY); break;
                    case 3 : temp.addHead(temp.headX, temp.headY + temp.unitSize);
                }
            } else {
                return {message : 'orientation is missing'};
            }
        };
    };

module.exports = Game;
