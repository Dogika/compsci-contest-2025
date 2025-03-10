function BulletBehavior(timestamp, forwardSpeed, forwardAccel, rotationSpeed, rotationOffset, targetPlayer=false) {
    this.timestamp = timestamp;
    this.forwardSpeed = forwardSpeed;
    this.forwardAccel = forwardAccel;
    this.rotationSpeed = rotationSpeed; // pos: ccw, neg: cw
    this.rotationOffset = rotationOffset; // initial offset when executed; after delay
    this.targetPlayer = targetPlayer;
}

function Pattern(bulletType=null, petals=0, petalOffset=0, x_bullets=0, x_angle=0, z_bullets=0, z_difference=0, z_offset=0, showStart=0, showOffset=0, towardsPlayer=false) {
    this.bulletType = bulletType; // allows for editing behavior list without affecting global type
    this.petals = petals;
    this.petalOffset = petalOffset;
    this.x_bullets = x_bullets;
    this.x_angle = x_angle;
    this.z_bullets = z_bullets;
    this.z_difference = z_difference;
    this.z_offset = z_offset;
    this.showStart = showStart;
    this.showOffset = showOffset;
    this.loopColorID;
    this.hueShift;
    this.towardsPlayer = towardsPlayer;
}
