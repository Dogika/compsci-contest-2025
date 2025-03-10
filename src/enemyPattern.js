function firePattern(patternCopy, enemy_x, enemy_y) {
    let patternInstanceID = g_patternInstanceIDs++;
    g_patternInstances[patternInstanceID] = [];
    
    let spawnedBullets = 0;
    
    for (let petal = 0; petal < patternCopy.petals; petal++) {
        
        let petal_angle = 2 * Math.PI * petal / patternCopy.petals + patternCopy.petalOffset;
        
        for (
            let x = (1 - patternCopy.x_bullets) * 0.5 * patternCopy.x_angle; 
            x <= (patternCopy.x_bullets - 1) * 0.5 * patternCopy.x_angle; 
            x += patternCopy.x_angle
        ) {
            
            let bullet_angle = petal_angle + x;
            
            for (let z = 0; z < patternCopy.z_bullets; z++) {
                
                spawnBullet(
                    patternCopy.bulletType, 
                    enemy_x, 
                    enemy_y, 
                    bullet_angle, 
                    patternCopy.z_offset,
                    patternInstanceID,
                    z * patternCopy.z_difference + 1,
                    g_currentTime + patternCopy.showStart + spawnedBullets++ * patternCopy.showOffset,
                    patternCopy.loopColorID,
                    patternCopy.towardsPlayer
                );
                
                if (typeof patternCopy.hueShift === "number") g_loopColors[patternCopy.loopColorID] = changeHue(g_loopColors[patternCopy.loopColorID], patternCopy.hueShift);
            }
            if (patternCopy.x_angle == 0) break;
        }
        
    }
    
    for (let behavior of patternCopy.bulletType.behaviors) {
        let executableMethod = createChangePatternBulletsBehaviorMethod(behavior, patternInstanceID);
        g_timeline.push(new Event(g_currentTime + behavior.timestamp * g_invTimeDialation, executableMethod))
    }
}
