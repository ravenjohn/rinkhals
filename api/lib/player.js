/*jslint node: true */
"use strict";

/**
 *  Player.js
 *  - Player abstraction
 *
 */

var Player = function (id, index, name) {

    this.id = id;
    this.index = index;
    this.name = name;
    this.unitSize = 10;
    this.length = 5;
    this.headX = null;
    this.headY = null;
    this.orientation = 2;
    this.body = {};
};

module.exports = Player;
