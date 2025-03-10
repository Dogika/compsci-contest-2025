function rotate(vx, vy, rx, ry) {
    return [vx * rx - vy * ry, vx * ry + vy * rx];
}

function expDecay(a, b, decay, dt) {
    return b + (a - b) * Math.exp(-decay * dt);
}

function normalize(v) {
    var inv_magnitude = 1 / Math.hypot(...v);
    if (v.length == 2) return scale2(inv_magnitude, v);
    if (v.length == 3) return scale3(inv_magnitude, v);
}

function setMagnitude(m, v) {
    var new_magnitude = m / Math.hypot(...v);
    if (v.length == 2) return scale2(new_magnitude, v);
    if (v.length == 3) return scale3(new_magnitude, v);
}

function cross(v1, v2) {
    var [x1, y1, z1] = v1;
    var [x2, y2, z2] = v2;
    
    return [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2];
}

function scale2(s, v1) {
    var [x1, y1] = v1;
    
    return [s * x1, s * y1];
}

function scale3(s, v1) {
    var [x1, y1, z1] = v1;
    
    return [s * x1, s * y1, s * z1];
}

function mult2(v1, v2) {
    var [x1, y1] = v1;
    var [x2, y2] = v2;
    
    return [x1 * x2, y1 * y2];
}

function mult3(v1, v2) {
    var [x1, y1, z1] = v1;
    var [x2, y2, z2] = v2;
    
    return [x1 * x2, y1 * y2, z1 * z2];
}

function add2(v1, v2) {
    var [x1, y1] = v1;
    var [x2, y2] = v2;
    
    return [x1 + x2, y1 + y2];
}

function add3(v1, v2) {
    var [x1, y1, z1] = v1;
    var [x2, y2, z2] = v2;
    
    return [x1 + x2, y1 + y2, z1 + z2];
}

function subtract2(v1, v2) {
    var [x1, y1] = v1;
    var [x2, y2] = v2;
    
    return [x1 - x2, y1 - y2];
}

function subtract3(v1, v2) {
    var [x1, y1, z1] = v1;
    var [x2, y2, z2] = v2;
    
    return [x1 - x2, y1 - y2, z1 - z2];
}
