function PlayerBulletObject(type, x=0, y=0, vx=0, vy=-1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = vx;
    this.vy = vy;
    if (this.type.lifespan) {
        this.timestampDeath = g_currentTime + this.type.lifespan;
    }
    
    this.updatePosition = (deltaTime) => {
        this.x += this.vx * deltaTime * G_PREFERED_SCALAR;
        this.y += this.vy * deltaTime * G_PREFERED_SCALAR;
    }
    
    this.display = (ctx) => {
        let show_x, show_y;
        if (this.parent) {
            show_x = this.parent.x + this.x + g_camera.x;
            show_y = this.parent.y + this.y + g_camera.y;
        } else {
            show_x = this.x + g_camera.x;
            show_y = this.y + g_camera.y;
        }
        
        if (this.type.center) drawCircle(ctx, show_x, show_y, this.type.radius*0.8, Color.WHITE);
        
        if (this.type.shape == "circle") {
            addCircleBorder(ctx, show_x, show_y, this.type.radius, this.type.color, this.type.width);
        } else if (this.type.shape == "diamond") {
            let [dx, dy] = normalize([this.vx, this.vy]);
            addDiamondBorder(ctx, show_x, show_y, dx, dy, this.type.radius, this.type.color, this.type.width);
        } else if (this.type.shape == "triangle") {
            let [dx, dy] = normalize([this.vx, this.vy]);
            addTriangleBorder(ctx, show_x, show_y, dx, dy, this.type.radius, this.type.color, this.type.width);
        }
    }
}

function PlayerBulletType(damage=1, radius=4, shape="circle", width=2, color=Color.WHITE, center=true, bounceOffWalls=false, lifespan=undefined) {
    this.damage = damage;
    this.radius = radius * G_PREFERED_SCALAR;
    this.shape = shape;
    this.width = width;
    this.color = color;
    this.center = center;
    this.bounceOffWalls = bounceOffWalls;
    this.lifespan = lifespan;
}
