/*jslint node: true */
"use strict";

var config = {
    "mode" : "development",
    "development" : {
        "mode"                  : "debug",
		"port"                  : 8080,
		"debug"                 : true,
        "maxPlayers"            : 50,
        "unitSize"              : 10
    },
    "production" : {
    }
};

module.exports = config[config.mode];
