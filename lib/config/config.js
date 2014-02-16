var config = {
    "development" : {
		"port"                  : process.env.PORT || 5000,
		"debug"                 : true
    },
    "production" : {
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];
