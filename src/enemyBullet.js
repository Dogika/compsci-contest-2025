function BulletObject(bulletType=null, x=0, y=0, dx=0, dy=0, speedCoefficient=1, patternInstanceID=0, showTimestamp=0, loopColorID=null) {
    this.bulletType = bulletType;
    this.x = x;
    this.y = y;
    this.vx = dx * speedCoefficient;
    this.vy = dy * speedCoefficient;
    this.dx = dx;
    this.dy = dy;
    this.rx = 1;
    this.ry = 0;
    this.speedCoefficient = speedCoefficient;
    this.patternInstanceID = patternInstanceID;
    this.forwardSpeed = 0;
    this.forwardAccel = 0;
    this.visible = false;
    this.showTimestamp = showTimestamp;
    if (typeof loopColorID === "number") {
        this.instanceColor = g_loopColors[loopColorID];
    } else {
        this.instanceColor = bulletType.color;
    }
    
    this.updatePosition = (deltaTime) => {
        this.x += this.vx * deltaTime * this.speedCoefficient * G_PREFERED_SCALAR;
        this.y += this.vy * deltaTime * this.speedCoefficient * G_PREFERED_SCALAR;
        let dx_1 = this.dx * this.rx - this.dy * this.ry;
        let dy_1 = this.dx * this.ry + this.dy * this.rx;
        this.dx = dx_1;
        this.dy = dy_1;
        if (this.forwardAccel != 0) this.forwardSpeed = Math.max(this.bulletType.minSpeed, Math.min(this.forwardSpeed + this.forwardAccel * deltaTime, this.bulletType.maxSpeed));
        this.vx = dx_1 * this.forwardSpeed;
        this.vy = dy_1 * this.forwardSpeed;
    }
    
    this.display = (ctx) => {
        
        if (!this.visible) return;
        
        let show_x = this.x + g_camera.x;
        let show_y = this.y + g_camera.y;
        
        drawCircle(ctx, show_x, show_y, this.bulletType.radius, Color.WHITE);
        
        if (this.bulletType.shape == "circle") {
            addCircleBorder(ctx, show_x, show_y, this.bulletType.radius*1.4, this.instanceColor);
        } else if (this.bulletType.shape == "diamond") {
            addDiamondBorder(ctx, show_x, show_y, this.dx, this.dy, this.bulletType.radius*1.4, this.instanceColor);
        } else if (this.bulletType.shape == "triangle") {
            addTriangleBorder(ctx, show_x, show_y, this.dx, this.dy, this.bulletType.radius*1.4, this.instanceColor);
        }
    }
}

function BulletType(behaviors=[], radius=5, shape="circle", minSpeed=0, maxSpeed=1, color) {
    this.behaviors = behaviors;
    this.radius = radius;
    this.shape = shape; // circle, diamond, triangle
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    if (!color) {
        if (shape == "circle") {
            this.color = Color.CYAN;
        } else if (shape == "diamond") {
            this.color = Color.YELLOW;
        } else if (shape == "triangle") {
            this.color = Color.GREEN;
        }
        return;
    }
    this.color = color;
}

function spawnBullet(bulletTypeCopy, x=0, y=0, angle=0, offset=0, patternInstanceID=0, speedCoefficient=1, showTimestamp=0, loopColorID=null, patternTowardsPlayer) {
    
    let dx = Math.cos(angle % (2 * Math.PI));
    let dy = Math.sin(angle % (2 * Math.PI));
    
    if (patternTowardsPlayer) {
        let c = g_player.x - x;
        let s = g_player.y - y;
        let m = Math.hypot(c, s);
        c/=m;
        s/=m;
        
        let dx_1 = dx * c + dy * -s;
        let dy_1 = dx * s + dy *  c;
        
        dx = dx_1;
        dy = dy_1;
    }
    
    let bullet = new BulletObject(bulletTypeCopy, x, y, dx, dy, speedCoefficient, patternInstanceID, showTimestamp, loopColorID);
    
    if (offset != 0) {
        bullet.x += dx * offset;
        bullet.y += dy * offset;
    }
    
    g_patternInstances[patternInstanceID].push(bullet);
}
