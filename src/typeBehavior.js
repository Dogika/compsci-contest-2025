function FirePatternBehavior(timestamp, pattern, loopColorID=null, hueShift=null) {
    this.type = "firePattern"; // "firePattern", "move"
    this.timestamp = timestamp;
    this.pattern = pattern;
    this.loopColorID = loopColorID;
    this.hueShift = hueShift;
}

function pattern_loop(initial_time, pattern, loops, interval=0, rotation_offset=0, initialColor=pattern.bulletType.color, hueShift=0) {
    let loopColorID = g_loopColorIDs++;
    g_loopColors[loopColorID] = initialColor;
    let behavior_list = [];
    let behavior = new FirePatternBehavior(initial_time, pattern, loopColorID, hueShift);
    for (let i = 0; i < loops; i++) {
        behavior_list.push(structuredClone(behavior));
        behavior.timestamp += interval;
        pattern.petalOffset += rotation_offset;
    }
    return behavior_list;
}

function MoveIntegrationBehavior(timestamp, final_time, final_x, final_y) {
    this.type = "moveIntegration";
    this.timestamp = timestamp;
    this.final_x = final_x;
    this.final_y = final_y;
    this.final_time = final_time;
}

function MoveDecayBehavior(timestamp, final_x, final_y, decaySpeed, lockPlayer=false) {
    this.type = "moveDecay";
    this.timestamp = timestamp;
    this.final_x = final_x;
    this.final_y = final_y;
    this.decaySpeed = decaySpeed;
    this.lockPlayer = lockPlayer;
}

function MoveNowhereBehavior(timestamp) {
    this.type = "moveNowhere";
    this.timestamp = timestamp;
}


/*
Story and setting:

Start the game with a boot up sequence 
like a terminal.

Instead of having the risk from dodging 
into bullets gives health, I think it 
would fit better with the theme if the 
player healed by absorbing blood through 
their cyborg armor.

Pure humans are extinct so robots go to heck in search of blood.

When you die show an error in the terminal 
saying not enough blood

Enemy types:
    Husks: Physical manifestation of the souls of the damned.
    
        Filth (Weak/Horde/Common) - Runs towards the player 
                                    and lunges at them
                                    Represents the soul of human filth
        
        Stray (Archer type) - Distances themself 
                              and shoots one bullet at the player
                                 (could be a fireball because its not a robot)
                              Represents the soul of a blasphemous or heretical person
        
    Machines: Robots and cyborgs that use blood as fuel.
    
        The player - Not an enemy.
    
        Drone (Horde) - Surrounds player, 
                Shooting a random spread of bullets (wide or long), 
                Does an explosive dive into the player when it loses all its blood
                
        Clone - Version of the player that does what they can do
                Very aggressive
    
    Demons: Evil energy from heck concentrated into anthropomorphized stone. Created to kick out the intruders of heck.
    
        Malicious Face - Random movement,
                         Charged laser,
                         Number of regular bullets shot in a row
        
        Cerberus (Miniboss) - Guard of heck,
                   Has an explosive orb that follows them around they can throw at the player at high velocities
                   Dashes towards the player
                   Creates a shockwave,
*/
