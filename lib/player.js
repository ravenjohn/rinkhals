/*jslint node: true */
"use strict";

/**
 *  Player.js
 *  - Player abstraction
 *
 */

var Player = function (id, index, name, color) {

    this.id = id;
    this.index = index;
    this.name = name;
    this.color = color;
    
    this.interval = null;

    this.speed = 100;
    this.unitSize = 10;
    this.length = 5;
    this.headX = null;
    this.headY = null;
    this.orientation = 2;
    this.body = [];
    this.selfCollision = false;

    this.addHead = function (d, x, y) {
        var i = this.body.length;
        x = (x < 0) ? d.w + x : x % d.w;
        y = (y < 0) ? d.h + y : y % d.h;
        
        while (i--) {
            if (this.body[i] === x + '-' + y) {
                this.selfCollision = true;
                return;
            }
        }
        
        this.body.length > 5 && this.body.pop();
        this.headX = x;
        this.headY = y;
        this.body.unshift(x + '-' + y);
    };

    this.reset = function (x, y) {
        this.headX = x;
        this.headY = y;
        this.speed = 100;
        this.unitSize = 10;
        this.length = 5;
        this.orientation = 2;
        this.body = [];
        this.selfCollision = false;
    };
};

module.exports = Player;
