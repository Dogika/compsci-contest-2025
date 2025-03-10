function Hitscan(initType, origin_x=0, origin_y=0, dx=0, dy=0) {
    this.type = structuredClone(initType);
    this.origin_x = origin_x;
    this.origin_y = origin_y;
    this.dx = dx;
    this.dy = dy;
    this.hitTime = 0;
    this.hitEnemies = [];
}

function HitscanType(damage, width, color, fade=false) {
    this.width = width;
    this.color = color;
    this.fade  = fade;
    this.damage = damage;
}

// returns t value
Hitscan.prototype.horizontalCollision = function(y) {
    return (y - this.origin_y) / this.dy;
}

Hitscan.prototype.verticalCollision = function(x) {
    return (x - this.origin_x) / this.dx;
}

Hitscan.prototype.circularCollision = function(x, y, r) {
    let cToOrigin_x = this.origin_x - x;
    let cToOrigin_y = this.origin_y - y;
    let a = this.dx * this.dx + this.dy * this.dy;
    let b = 2 * (this.dx * cToOrigin_x + this.dy * cToOrigin_y);
    let c = cToOrigin_x * cToOrigin_x + cToOrigin_y * cToOrigin_y - r * r;
    let delta = b * b - 4 * a * c;
    if (delta < 0) return [false, NaN];
    return [true, (-b-Math.sqrt(delta)) / (2 * a)];
}

Hitscan.prototype.getX = function(time) {
    return this.origin_x + this.dx * time;
}

Hitscan.prototype.getY = function(time) {
    return this.origin_y + this.dy * time;
}

Hitscan.prototype.display = function(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.type.width;
    ctx.lineCap = "round"; 
    ctx.moveTo(this.origin_x + g_camera.x, this.origin_y + g_camera.y);
    ctx.lineTo(this.origin_x + this.dx * this.hitTime + g_camera.x, this.origin_y + this.dy * this.hitTime + g_camera.y);
    ctx.strokeStyle = this.type.color;
    ctx.stroke();
    ctx.lineCap = "butt"; // without resetting it, it will lag the game
}

function findTime(hitscan) {
    let time = G_FARAWAY;
    
    let hitEnemy;
    for (let i = 0; i < g_enemyInstances.length; i++) {
        let enemy = g_enemyInstances[i];
        let [hit, currentTime] = hitscan.circularCollision(enemy.x, enemy.y, enemy.enemyType.radius);
        if (hit && currentTime < time && currentTime > 0) {
            time = currentTime;
            hitEnemy = enemy;
        }
    }
    if (hitEnemy) hitscan.hitEnemies.push(hitEnemy);
    
    let currentTime = hitscan.horizontalCollision(g_screenCenterFocus_y+g_screenHeight*0.5-G_WALL_THICKNESS);
    if (currentTime < time && currentTime > 0) {
        time = currentTime;
    } else {
        currentTime = hitscan.horizontalCollision(g_screenCenterFocus_y-g_screenHeight*0.5+G_WALL_THICKNESS);
        if (currentTime < time && currentTime > 0) {
            time = currentTime;
        }
    }
    
    currentTime = hitscan.verticalCollision(g_screenCenterFocus_x+g_screenWidth*0.5-G_WALL_THICKNESS);
    if (currentTime < time && currentTime > 0) {
        time = currentTime;
    } else {
        currentTime = hitscan.verticalCollision(g_screenCenterFocus_x-g_screenWidth*0.5+G_WALL_THICKNESS);
        if (currentTime < time && currentTime > 0) {
            time = currentTime;
        }
    }
    hitscan.hitTime = time;
}

function createPlayerHitscan(hitscan_t, offset_x=0, offset_y=0) {
    let hitscan = new Hitscan(hitscan_t);
    
    hitscan.origin_x = g_player.x + offset_x;
    hitscan.origin_y = g_player.y + offset_y;
    
    [hitscan.dx, hitscan.dy] = normalize([g_target.x - hitscan.origin_x, g_target.y - hitscan.origin_y]);
    
    findTime(hitscan);
    
    g_playerHitscanInstances.push(hitscan);
}

function setPlayerHitscan(hitscan, offset_x, offset_y) {
    hitscan.origin_x = g_player.x + offset_x;
    hitscan.origin_y = g_player.y + offset_y;
    
    [hitscan.dx, hitscan.dy] = normalize([g_target.x - hitscan.origin_x, g_target.y - hitscan.origin_y]);
    
    findTime(hitscan);
}
