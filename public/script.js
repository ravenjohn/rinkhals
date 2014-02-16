(function (src, callback) {
    var i = src.length, s;

    document.body.innerHTML += '<div id="_snake_cover"></div>';

    while (i--) {
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://' + src[i] + '/socket.io/socket.io.js';
        s.async = false;
        s.onreadystatechange = s.onload = function () {
            callback(this, src[i]);
        };
        document.body.appendChild(s);
        if (typeof io !== '' + void 0)
            break;
    }

} (['desolate-bastion-8292.herokuapp.com', 'localhost:5000'], function (root, src) {

    var snakes,
        mysnake,
        cache = +new Date,
        width = 300,
        height = 300,
        speed = 800,
        socket = io.connect('http://' + src),
        b = document.getElementById('_snake_cover'),
        Snake = function (x, y, color) {
            this.headX = x;
            this.headY = y;            
            this.color = color;

            this.body = [];
            this.orientation = 2;
            this.unitSize = 10;
            this.length = 5;
            this.deaths = 0;
            this.drawHead = function (x, y) {
                var temp, i;

                this.headX = x = (x < 0) ? width + x : x % width;
                this.headY = y = (y < 0) ? height + y : y % height;

                if (temp = document.querySelector('.food' + x + '' + y)) {
                    this.length++;
                    temp.remove();
                } else if (document.querySelectorAll('.r' + x + '' + y).length) {
                    stopAllIntervals();
                    return;
                }

                while (this.body.length > this.length) {
                    this.body.pop().remove();
                }

                (temp = this.body[0]) && (temp.style.background = this.color);
                temp = document.createElement('div');
                temp.style.width = temp.style.height = this.unitSize + 'px';
                temp.className = 'r' + x + '' +  y;
                temp.style.position = 'absolute';
                temp.style.zIndex = 999999;
                temp.style.left = x + 'px';
                temp.style.top = y + 'px';
                temp.style.background = 'red';
                temp.x = x;
                temp.y = y;
                b.appendChild(temp);
                this.body.unshift(temp);
            };
            this.bodyData = function () {
                var i = this.body.length, ret = [];
                while (i--) {
                    ret.push([this.body[i].x, this.body[i].y]);
                }
                return ret;
            };
        },
        stopAllIntervals = function () {
            var i;
            for (i in snakes)
                clearInterval(snakes[i].interval);
        },
        start = function () {
            var i;
            for (i in snakes) {
                temp = snakes[i];
                temp.interval = setInterval(function (temp) {
                    switch (temp.orientation) {
                        case 0 : temp.drawHead(temp.headX - temp.unitSize, temp.headY); break;
                        case 1 : temp.drawHead(temp.headX, temp.headY - temp.unitSize); break;
                        case 2 : temp.drawHead(temp.headX + temp.unitSize, temp.headY); break;
                        case 3 : temp.drawHead(temp.headX, temp.headY + temp.unitSize);
                    }
                }, speed, temp);
            }
        };

    b.style.position = 'fixed';
    b.style.top = 0;
    b.style.left = 0;
    b.style.border = '1px solid red';
    
    socket.on("id", function (data) {
        location.hash = data.id;
    });
    
    socket.on("start", function () {
        stopAllIntervals();
        start();
    });
    
    socket.on('setup game', function (data) {
        var i, temp;
        snakes = {};
        for (i in data.players) {
            snakes[i] = new Snake(data.players[i].headX, data.players[i].headY, data.players[i].color);
        }
        mysnake = snakes[socket.socket.sessionid];
        b.style.width = data.w + 'px';
        b.style.height = data.h + 'px';
    });

    socket.on('move', function (data) {
        snakes[data.id].orientation = data.orientation;
    });
    
    socket.on('spawnFood', function (data) {
        var temp = document.createElement('div');
        temp.style.width = temp.style.height = '10px';
        temp.style.position = 'absolute';
        temp.style.zIndex = 999999;
        temp.style.borderRadius = '5px';
        temp.style.left = data.x + 'px';
        temp.style.top = data.y + 'px';
        temp.className = 'food' + data.x + '' + data.y;
        temp.style.background = 'black';
        b.appendChild(temp);
    });

    socket.on('collision', function (data) {
        stopAllIntervals();
        if (data.id === 'tie') {
            alert('You bump into each other :O sweet.');
        } else if (data.id === socket.socket.sessionid) {
            alert('You lose! booooooo');
            if (confirm('Do you want to revenge?')) {
                socket.emit('restart');
            } else {
                alert("Indeed. You're a loser.");
            }
        } else {
            alert('You won! yay');
        }
    });

    document.body.onkeydown = function (e) {
        var temp = e.keyCode - 37;
        if (temp > -1 && temp < 4 && ~~(temp - mysnake.orientation) % 2 && (+new Date - cache) > speed) {
            //mysnake.orientation = temp;
            cache = +new Date;
            socket.emit('move', {orientation : temp, body : mysnake.bodyData()});
        }
    };

    if (location.hash.substring(1)) {
        socket.emit("new", {
            id : location.hash.substring(1),
            name : prompt("Name") || "Other Player"
        });
    } else {
        socket.emit("new", {
            m : prompt("Max players [1-50]"),
            name : prompt("Name") || "Player One",
            h : height,
            w : width
        });
    }
}));
