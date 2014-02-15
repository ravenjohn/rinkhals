(function (src, callback) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.async = false;
    s.onreadystatechange = s.onload = function () {
        var state = s.readyState;
        (!state || /loaded|complete/.test(state)) && callback(this, src.substring(0, src.length - 23));
    };
    document.body.appendChild(s);
    document.body.innerHTML += '<div id="_snake_cover"></div>';

} ('http://ravenjohn.adin234.tk:8080/socket.io/socket.io.js', function (root, src) {
// } ('http://localhost:8080/socket.io/socket.io.js', function (root, src) {
// } ('http://192.168.1.50:8080/socket.io/socket.io.js', function (root, src) {

    var snakes,
        mysnake,
        interval,
        gameStarted = false,
        socket = io.connect(src),
        // width = ~~(window.innerWidth / 10) * 10,
        // height = ~~(window.innerHeight / 10) * 10,
        width = 1000,
        height = 500,
        b = document.getElementById('_snake_cover'),
        Snake = function (color) {
            this.color = color;
            
            this.body = [];
            this.orientation = 2;
            this.unitSize = 10;
            this.drawHead = function (x, y) {
                var temp;

                //if (document.querySelectorAll('.r' + x + y).length)
                //    return start();

                this.body.length > 5 && (temp = this.body.pop()) && temp.remove();
                (temp = this.body[0]) && (temp.style.background = this.color);
                temp = document.createElement('div');
                temp.style.width = temp.style.height = this.unitSize + 'px';
                temp.className = 'r' + x + y;
                temp.style.position = 'absolute';
                temp.style.zIndex = 999999;
                temp.style.left = x + 'px';
                temp.style.top = y + 'px';
                temp.style.background = 'red';
                this.body.unshift(temp);
                b.appendChild(temp);
            }
        };
    
    b.style.position = 'fixed';
    b.style.top = 0;
    b.style.left = 0;
    b.style.border = '1px solid red';
    
    socket.on("id", function (data) {
        location.hash = data.id;
    });
    
    socket.on('setup game', function (data) {
        var i, temp;
        snakes = {};
        for (i in data.players) {
            snakes[i] = new Snake(data.players[i].color);
        }
        mysnake = snakes[socket.socket.sessionid];
        b.style.width = data.w + 'px';
        b.style.height = data.h + 'px';
    });
              
    socket.on('move', function (data) {
        console.log('move', data.orientation, data.headX, data.headY);
        snakes[data.id].orientation = data.orientation;
        snakes[data.id].drawHead(data.headX, data.headY);
    });
    
    socket.on('collision', function (data) {
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
        (temp > -1 && temp < 4 && ~~(temp - mysnake.orientation) % 2) && socket.emit('move', {orientation : temp});
    };

    if (confirm("New Game?")) {
        socket.emit("new", {
            id : prompt("ID"),
            maxPlayers : prompt("Max players [1-50]"),
            name : prompt("Name") || "Player One",
            h : height,
            w : width
        });
    }
    else {
        socket.emit("new", {
            id : prompt("ID"),
            name : prompt("Name") || "Player One",
            h : height,
            w : width
        });    
    }
}));
