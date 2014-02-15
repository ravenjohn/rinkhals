var config = {
    "mode" : "development",
    "development" : {
		"port"                  : 3000,
		"debug"                 : true,
        "maxPlayers"            : 10,
        "unitSize"              : 10
    },
    "production" : {
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];
