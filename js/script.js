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

    var snakes,
        mysnake,
        interval,
        gameStarted = false,
        socket = io.connect(src),
        width = ~~(window.innerWidth / 10) * 10,
        height = ~~(window.innerHeight / 10) * 10,
        b = document.getElementById('_snake_cover'),
        Snake = function (x, y) {
            this.unitSize = 10;
            this.body = [];
            this.headX = x;
            this.headY = y;
            this.orientation = 2;
            this.drawHead = function (x, y) {
                var temp;

                //if (document.querySelectorAll('.r' + x + y).length)
                //    return start();

                this.body.length > 5 && (temp = this.body.pop()) && temp.remove();
                (temp = this.body[0]) && (temp.style.background = 'black');
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
        },
        start = function () {
            var i;
            gameStarted = true;
            interval = setInterval(function () {
               var i, temp;
               for (i in snakes){
                   temp = snakes[i];
                   switch (temp.orientation) {
                       case 0 : temp.drawHead(temp.headX - temp.unitSize, temp.headY); break;
                       case 1 : temp.drawHead(temp.headX, temp.headY - temp.unitSize); break;
                       case 2 : temp.drawHead(temp.headX + temp.unitSize, temp.headY); break;
                       case 3 : temp.drawHead(temp.headX, temp.headY + temp.unitSize);
                   }
               }
            }, 100);
        };
    
    b.style.position = 'fixed';
    b.style.top = 0;
    b.style.left = 0;
    
    socket.on("id", function (data) {
        location.hash = data.id;
    });
    
    socket.on('setup game', function (data) {
        var i, temp;
        snakes = {};
        for (i in data.players) {
            snakes[i] = new Snake(data.players[i].headX, data.players[i].headY);
        }
        mysnake = snakes[socket.socket.sessionid];
        b.style.width = data.w + 'px';
        b.style.height = data.h + 'px';
        console.log(data.playerCount);
        //if(!gameStarted && data.playerCount === 2) start ();
    });
              
    socket.on('move', function (data) {
        //snakes[data.id].orientation = data.orientation;
        var i, temp;
        for (i in data){
            snakes[i].orientation = data[i].orientation;
            snakes[i].headX = data[i].headX;
            snakes[i].headY = data[i].headY;
            temp = snakes[i];
            temp.drawHead(temp.headX, temp.headY); break;
        }
    });

    document.body.onkeydown = function (e) {
        var temp = e.keyCode - 37;
        (temp > -1 && temp < 4 && ~~(temp - mysnake.orientation) % 2) && socket.emit('move', {orientation : temp});
    };

    socket.emit("new", {
        id : prompt("ID"),
        name : prompt("Name") || "Player One",
        h : height,
        w : width
    });
}));
