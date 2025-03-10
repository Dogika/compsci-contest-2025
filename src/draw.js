const drawButtonFontSize = (30 * G_PREFERED_SCALAR).toString();
function drawButton(button) {
    if(button.hitbox.containsPoint(g_mouse.x, g_mouse.y)) {
        button.hitbox.setColor(Color.RED);
    } else {
        button.hitbox.setColor(Color.WHITE);
    }
    add(button.hitbox);
    let txt = new Text(button.text, drawButtonFontSize+"pt VCR OSD Mono");
    txt.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt.setColor(Color.BLACK);
    txt.setPosition(button.x, button.y+2);
    add(txt);
}

function castShadow(ctx, x, y, r) {
    let thisVector = [x, y, r]; // r = radius = height
    
    let n1 = normalize(subtract3(g_lightSource, thisVector));
    let enemyAxis = setMagnitude(r, cross(n1, cross(n1, G_Z_AXIS))); // perpendicular to n1
    
    let top = add3(thisVector, enemyAxis)
    let bottom = subtract3(thisVector, enemyAxis);
    
    let n2 = normalize(subtract3(g_lightSource, top));
    let n3 = normalize(subtract3(g_lightSource, bottom));
    
    let topProjectionFactor = top[G_Z] / n2[G_Z];
    //let middleProjectionFactor = thisVector[G_Z] / n1[G_Z];
    let bottomProjectionFactor = bottom[G_Z] / n3[G_Z];
    
    let topProjection = subtract2(top.slice(0, 2), scale2(topProjectionFactor, n2.slice(0, 2)));
    //let [middle_x, middle_y] = subtract2(thisVector.slice(0, 2), scale2(middleProjectionFactor, n1.slice(0, 2)));
    let bottomProjection = subtract2(bottom.slice(0, 2), scale2(bottomProjectionFactor, n3.slice(0, 2)));
     
    let [middle_x, middle_y] = scale2(0.5, add2(topProjection, bottomProjection));
    let shadowRadius = Math.max(1, 0.5 * Math.hypot(...subtract2(topProjection, bottomProjection)));
    let shadowAngle = Math.atan2(...subtract2(topProjection, bottomProjection).reverse());
    
    ctx.beginPath();
    ctx.ellipse(
        middle_x + g_camera.x, 
        middle_y + g_camera.y, 
        shadowRadius, 
        r, 
        shadowAngle, 
        0, 2 * Math.PI
    );
    ctx.fillStyle = Color.BLACK;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function drawCircle(ctx, x, y, radius, color, alpha=1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawArc(ctx, x, y, radius, color, fraction1, fraction2, alpha=1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, fraction1 * 2 * Math.PI, fraction2 * 2 * Math.PI);
    ctx.lineTo(x, y);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawStretchedCircle(ctx, x, y, radius, color, stretchFactor, angle, alpha=1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(x, y,radius * stretchFactor, radius, angle, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawStretchedArc(ctx, x, y, radius, color, stretchFactor, angle, fraction1, fraction2, alpha=1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * stretchFactor, radius, angle, fraction1 * 2 * Math.PI, fraction2 * 2 * Math.PI);
    ctx.lineTo(x, y);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}


function displayStaminaMeter(ctx, x, y) {
    ctx.beginPath();
    const rad = G_PREFERED_SCALAR * 5;
    let pos_x = x + g_player.radius + rad;
    let pos_y = y - g_player.radius - rad;
    
    drawArc(ctx, pos_x, pos_y, rad, Color.ORANGE, 0, g_player.stamina / 3);
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos_x, pos_y);
    ctx.lineTo(pos_x - rad * 0.5, pos_y + rad * 0.866025403784);
    ctx.moveTo(pos_x, pos_y);
    ctx.lineTo(pos_x - rad * 0.5, pos_y - rad * 0.866025403784);
    ctx.moveTo(pos_x, pos_y);
    ctx.lineTo(pos_x + rad, pos_y);
    
    ctx.strokeStyle = Color.BLACK;
    ctx.stroke();
}

function addCircleBorder(ctx, x, y, bullet_r, color=Color.CYAN, lineThickness=1) {
    ctx.beginPath();
    ctx.lineWidth = lineThickness;
    
    let radius = bullet_r * 1.3;
    
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function addDiamondBorder(ctx, x, y, vx, vy, bullet_r, color=Color.YELLOW, lineThickness=2) {
    ctx.beginPath();
    ctx.lineWidth = lineThickness;
    
    let length = bullet_r * 3;
    let width = bullet_r * 1.5;
    
    let m = Math.sqrt(vx * vx + vy * vy);
    let dx = vx / m * length;
    let dy = vy / m * length;
    
    let forward_x = x + dx;
    let forward_y = y + dy;
    let backward_x = x - dx ;
    let backward_y = y - dy;
    dx = dx / length * width;
    dy = dy / length * width;
    let leftward_x = x - dy; // 2d rotation matrix used for -90 and 90 degree turns
    let leftward_y = y + dx;
    let rightward_x = x + dy;
    let rightward_y = y - dx;
    
    ctx.moveTo(forward_x, forward_y);
    ctx.lineTo(leftward_x, leftward_y);
    ctx.moveTo(leftward_x, leftward_y);
    ctx.lineTo(backward_x, backward_y);
    ctx.moveTo(backward_x, backward_y);
    ctx.lineTo(rightward_x, rightward_y);
    ctx.moveTo(rightward_x, rightward_y);
    ctx.lineTo(forward_x, forward_y);
    
    ctx.strokeStyle = color;
    ctx.stroke();
}

function addTriangleBorder(ctx, x, y, vx, vy, bullet_r, color=Color.GREEN, lineThickness=1) {
    ctx.beginPath();
    ctx.lineWidth = lineThickness;
    
    let length = bullet_r * 2;
    
    let m = Math.sqrt(vx * vx + vy * vy);
    let dx0 = vx / m * length;
    let dy0 = vy / m * length;
    
    let c = -0.5;
    let s = 0.866025403784;
    
    let dx1 = dx0 *  c + dy0 * -s;
    let dy1 = dx0 *  s + dy0 *  c;  // 2d rotation matrix used for -120 and 120 degree turns
    
    let dx2 = dx0 *  c + dy0 *  s;
    let dy2 = dx0 * -s + dy0 *  c;
    
    let forward_x = x + dx0 * 1.3;
    let forward_y = y + dy0 * 1.3;
    let left_x = x + dx1;
    let left_y = y + dy1;
    let right_x = x + dx2;
    let right_y = y + dy2;
    
    ctx.moveTo(forward_x, forward_y);
    ctx.lineTo(left_x, left_y);
    ctx.lineTo(right_x, right_y);
    ctx.lineTo(forward_x, forward_y);
    
    ctx.strokeStyle = color;
    ctx.stroke();
}
