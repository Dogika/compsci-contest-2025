var currentGame = {
    world: [[]],
    spikes: new Map(),
    colors: new Map(),
    shouldSwapSpikes: false,
    state: "puzzle",
    starting_x: 0,
    starting_y: 0,
    player: {
        x: 1,
        y: 1,
        facingLeft: true,
        will: 0,
        keys: 0
    },
    scale: 0,
    win: false,
    worldIndex: 0
}

var worldList = [];

var world1 = [
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', 'W', 'W', 'W', ' ', 'P', 'W', 'W'],
    ['W', 'W', ' ', ' ', 'S', ' ', ' ', 'W', 'W'],
    ['W', 'W', ' ', 'S', ' ', 'S', 'W', 'W', 'W'],
    ['W', ' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', ' ', 'B', ' ', ' ', 'B', ' ', 'W', 'W'],
    ['W', ' ', 'B', ' ', 'B', ' ', 'G', 'M', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 23, false]
];

var world2 = [
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', ' ', ' ', ' ', ' ', 'W', 'W', 'W'],
    ['W', 'W', 'S', 'W', 'X', 'X', ' ', ' ', 'W'],
    ['W', ' ', 'X', 'W', 'W', 'BX','BX','B', 'W'],
    ['W', ' ', ' ', 'W', 'W', ' ', 'X', ' ', 'W'],
    ['W', 'P', ' ', 'W', 'W', 'G', 'S', ' ', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'M', ' ', 'S', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 23, false]
];

var controlBuffer = [];
var keyPressed = {};
var frame = 0;

function start() {
    keyDownMethod(keyDown);
    keyUpMethod(keyUp);
    
    worldList.push(world1);
    worldList.push(world2);
    
    tileColor();
    readWorld(worldList[currentGame.worldIndex]);
    requestAnimationFrame(tick);
}

function keyDown(e) {
    var key = e.key;
    if (!keyPressed[key]) {
        controlBuffer.push(key);
    }
    keyPressed[key] = true;
}

function keyUp(e) {
    keyPressed[e.key] = false;
}

function readWorld(world) {
    currentGame.spikes.clear();
    currentGame.win = false;
    currentGame.world = world.map((arr) => arr.slice());
    currentGame.scale = Math.ceil(Math.min(getHeight()/world.length, getWidth()/world[0].length));
    currentGame.player.will = world[world.length - 1][world[0].length];
    currentGame.shouldSwapSpikes = world[world.length - 1][world[0].length + 1];
    
    var foundPlayer = false;
    for (var i = 0; i < world.length; i++)
    for (var j = 0; j < world[0].length; j++) {
        
        if (!foundPlayer && world[i][j] == 'P') {
            
            currentGame.player.x = j;
            currentGame.player.y = i;
            foundPlayer = true;
            continue;
        }
        
        if (world[i][j].indexOf('X') > 0) {
            currentGame.spikes.set(i+""+j, true);
            
            currentGame.world[i][j] = world[i][j].substring(0, 1);
            continue;
        }
        
        if (world[i][j].indexOf('O') > 0) {
            currentGame.spikes.set(i+""+j, false);
            
            currentGame.world[i][j] = world[i][j].substring(0, 1);
        }
    }
    
    if (!foundPlayer) println("ERROR: No currentGame.player in world.");
}

function tileColor() {
    currentGame.colors['W'] = Color.BLACK;
    currentGame.colors['M'] = Color.RED;
    currentGame.colors['S'] = Color.GRAY;
    currentGame.colors['P'] = Color.GREEN;
    currentGame.colors['B'] = Color.BLUE;
    currentGame.colors['G'] = Color.ORANGE;
    currentGame.colors['K'] = Color.PURPLE;
    currentGame.colors['D'] = Color.YELLOW;
}

function tryMove(x, y) {
    if (currentGame.player.will < 1) {
        //fail();
        return false;
    }
    var forwardPlayerTile = currentGame.world[currentGame.player.y - y][currentGame.player.x + x];
    if (forwardPlayerTile == 'W') return false;
    currentGame.player.will -= 1;
    if (forwardPlayerTile == "S") {
        var forwardSkeletonTile = currentGame.world[currentGame.player.y - 2 * y][currentGame.player.x + 2 * x];
        if (forwardSkeletonTile == "S") return true;
        currentGame.world[currentGame.player.y - y][currentGame.player.x + x] = ' ';
        if (!(forwardSkeletonTile == "W" || forwardSkeletonTile == "B" || forwardSkeletonTile == "D")) currentGame.world[currentGame.player.y - 2 * y][currentGame.player.x + 2 * x] = 'S';
        return true;
    }
    if (forwardPlayerTile == "B") {
        var forwardBoxTile = currentGame.world[currentGame.player.y - 2 * y][currentGame.player.x + 2 * x];
        if (forwardBoxTile != ' ') return true;
        currentGame.world[currentGame.player.y - y][currentGame.player.x + x] = ' ';
        currentGame.world[currentGame.player.y - 2 * y][currentGame.player.x + 2 * x] = 'B';
        return true;
    }
    
    if (forwardPlayerTile == 'K') {
        currentGame.player.keys++;
    } else if (forwardPlayerTile == 'D') {
        if (currentGame.player.keys < 1) {
            return true;
        }
        currentGame.player.keys--;
    } else if (forwardPlayerTile == 'G') {
        currentGame.win = true;
    }
    currentGame.player.x += x; 
    currentGame.player.y -= y;
    return true
}

function swapSpikes() {
    for (var [key, value] of currentGame.spikes) {
        currentGame.spikes.set(key, value == false);
    }
}

function addAnimation(i, j, url1, url2, frames, framerate=avg_fps) {
    var picture = new WebImage(url1+(Math.floor(frame*framerate/avg_fps)%frames)+url2);
    picture.setSize(currentGame.scale, currentGame.scale);
    picture.setPosition(j * currentGame.scale, i * currentGame.scale)
    add(picture);
}

var time_arr = [];
var avg_fps = 1;

function tick(now) {
    removeAll();
    
    time_arr.unshift(now);
    if (time_arr.length > 10) {
        var time_0 = time_arr.pop();
        avg_fps = Math.floor(1000 * 10 / (now - time_0));
    }
    
    if (currentGame.win) {
        currentGame.worldIndex++;
        readWorld(worldList[currentGame.worldIndex]);
    }
    
    var turnSpent = false;
    var control = controlBuffer.remove(0);
    
    if (currentGame.state == "puzzle") {
        currentGame.world[currentGame.player.y][currentGame.player.x] = ' ';
        if (control == "w" || control == "ArrowUp") {
            turnSpent = tryMove( 0, +1);
        } else if (control == "a" || control == "ArrowLeft") {
            turnSpent = tryMove(-1,  0);
        } else if (control == "s" || control == "ArrowDown") {
            turnSpent = tryMove( 0, -1);
        } else if (control == "d" || control == "ArrowRight") {
            turnSpent = tryMove(+1,  0);
        }
        else if (control == "r") readWorld(worldList[currentGame.worldIndex]);
        else if (control == "1") readWorld(worldList[0]);
        else if (control == "2") readWorld(worldList[1]);
        else if (control == "3") readWorld(worldList[2]);
        else if (control == "4") readWorld(worldList[3]);
        else if (control == "5") readWorld(worldList[4]);
        else if (control == "6") readWorld(worldList[5]);
        else if (control == "7") readWorld(worldList[6]);
        else if (control == "8") readWorld(worldList[7]);
        else if (control == "9") readWorld(worldList[8]);
        else if (control == "0") readWorld(worldList[9]);
        if (turnSpent) {
            if (currentGame.shouldSwapSpikes) swapSpikes();
            if (currentGame.spikes.get(currentGame.player.y+""+currentGame.player.x)) {
                //spikeEffect()
                currentGame.player.will -= 1;
            }
        }
        currentGame.world[currentGame.player.y][currentGame.player.x] = 'P';
    }
    
    for (var i = 0; i < currentGame.world.length; i++)
    for (var j = 0; j < currentGame.world[0].length; j++) {
        if (currentGame.world[i][j] == 'M') {
            addAnimation(i, j, "https://aidanpastor.codehs.me/select_", ".png", 2, 60);
            continue;
        }
        var color = Color.RED;
        if (currentGame.spikes.get(i+""+j) != undefined) {
            if (currentGame.spikes.get(i+""+j)) {
                color = Color.WHITE;
            } else {
                color = Color.CYAN;
            }
        }
        if (currentGame.colors[currentGame.world[i][j]] != undefined) color = currentGame.colors[currentGame.world[i][j]];
        var rect = new Rectangle(currentGame.scale, currentGame.scale);
        rect.setPosition(j * currentGame.scale, i * currentGame.scale);
        rect.setColor(color);
        add(rect);
    }
    var text = currentGame.player.will;
    if (currentGame.player.will < 1) {
        text = "X";
    }
    var will = new Text(text, "17pt Arial");
    will.setPosition(currentGame.scale*0.5-will.getWidth()*0.5, currentGame.scale*currentGame.world.length-currentGame.scale*0.5+will.getHeight()*0.5);
    will.setColor(Color.WHITE);
    add(will);
    frame++;
    requestAnimationFrame(tick);
}
