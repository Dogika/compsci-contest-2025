function EnemyObject(enemyType=null, x=0, y=0) {
    this.enemyType = enemyType;
    this.x = x;
    this.y = y;
    this.health;
    this.movementType = "timeIntegration";
    this.vx = 0;
    this.vy = 0;
    this.final_x;
    this.final_y;
    this.decaySpeed;
    
    this.updatePosition = (deltaTime) => {
        
        if (this.movementType == "timeIntegration") {
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
        } else if (this.movementType == "positionDifferenceDecay") {
            this.x = expDecay(this.x, this.final_x, this.decaySpeed, deltaTime);
            this.y = expDecay(this.y, this.final_y, this.decaySpeed, deltaTime);
        }
    }
    
    this.display = (ctx) => {
        
        let show_x = this.x + g_camera.x;
        let show_y = this.y + g_camera.y;
        
        if (this.enemyType.name !== G_BOSS_NAME_0)
            castShadow(ctx, this.x, this.y, this.enemyType.radius);
        
        //body
        ctx.beginPath();
        ctx.arc(show_x, show_y, this.enemyType.radius, 0, Math.PI * 2);
        ctx.fillStyle = Color.YELLOW;
        ctx.fill();
        
        let [dx, dy] = normalize(subtract2([g_player.x, g_player.y], [this.x, this.y]));
        dx *= this.enemyType.radius * 0.707;
        dy *= this.enemyType.radius * 0.707;
        
        drawCircle(ctx, show_x + dx-dy, show_y + dx+dy, this.enemyType.radius*0.4, Color.WHITE);
        drawCircle(ctx, show_x + dx+dy, show_y + dy-dx, this.enemyType.radius*0.4, Color.WHITE);
    }
}

function EnemyType(name, behaviors=[], maxHealth=100) {
    this.name = name;
    this.behaviors = behaviors;
    this.maxHealth = maxHealth;
    this.radius = 30 * G_PREFERED_SCALAR;
    this.grounded; // if not grounded will allow player to knock them back
}

function spawnEnemy(enemyTypeCopy, isBoss=false) {
    let enemyInstanceID = g_enemyInstanceIDs++;
    let enemy = new EnemyObject(enemyTypeCopy, 0, 0);
    enemy.health = enemyTypeCopy.maxHealth;
    if (isBoss) {
        g_boss_ptr = enemy;
    }
    g_enemyInstances[enemyInstanceID] = enemy;
    for (let behavior of enemy.enemyType.behaviors) {
        let executableMethod = behavior.type == "firePattern" ? createFirePatternMethod(behavior, enemy) : createMoveEnemyMethod(behavior, enemy);
        g_timeline.push(new Event(g_currentTime + behavior.timestamp * g_invTimeDialation, executableMethod));
    }
}
