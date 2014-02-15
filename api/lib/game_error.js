var GameError = function (message, code) {
    this.name = "GameError";
    this.message = message || "";
    this.code = code || 0;
};

GameError.prototype = new Error();
GameError.prototype.constructor = GameError;

module.exports = GameError;
