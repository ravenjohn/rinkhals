/**
 *  Player.js
 *  - Player abstraction
 *
 */

var Player = function (id, index, name, color, x, y) {

    this.id = id;
    this.name = name;
    this.color = color;
    this.headX = x;
    this.headY = y;
};

module.exports = Player;
