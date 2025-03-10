let g_screenCenterFocus_x = G_SCREEN_CENTER_FOCUS_START_X;
let g_screenCenterFocus_y = G_SCREEN_CENTER_FOCUS_START_Y;
let g_screenBoundLeft = -1000000;
let g_screenBoundRight = 1000000;
let g_screenBoundTop = -1000000;
let g_screenBoundBottom = 1000000;

let g_patternInstances = [];
let g_patternInstanceIDs = 0;
let g_enemyInstances = [];
let g_enemyInstanceIDs = 0;
let g_playerBulletInstances = [];
let g_playerBulletInstanceIDs = 0;

let g_playerHitscanInstances = [];
let g_playerFadinHitscans = [];

let g_screenShakeInstances = [];

let g_loopColors = [];
let g_loopColorIDs = 0;

let g_listeners; // Listener[];
let g_timeline; // Event[]
let g_nextEvent_ptr;
let g_previousTime = 0;
let g_currentTime = 0;
let g_gameWindow = -1;
let g_gameLost = false;
let g_stats = {
    iTimeUsed : 0,
    damageDealt: 0
};

let g_target = {
    x: 0,
    y: 0
};

let g_lightSource = [0, 0, 200];
let g_lightOn = true;

let g_boss_ptr;
let g_timeSinceLastBossAttack;

let g_shootingLaser = false;

let g_titleAlpha = 1;

let g_timeDialation = 1;
let g_invTimeDialation = 1/g_timeDialation;

const g_mouse = {
    x: 0, y: 0,
    down: false,
    down2: false
};

let g_keyboard = {
    w: false,
    a: false,
    s: false,
    d: false
}; 
let g_trigger = {};

let bgm = {
    outOfCombat: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/0-1 Clean.wav'),
    inCombat: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/0-1.wav'),
    title: new Audio('')
}

let soundEffects = {
    revolverShoot: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Shoot1.wav'),
    nailgunSpin: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/MachineGunSpin.wav'),
    nailgunFire: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/MachineGun2.wav'),
    shotgunFire: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Steampunk%20Weapons%20-%20Shotgun%202%20-%20Shot%20-%2001.wav')
}

let g_volumeTotal = 0.5;
let g_volumeMusic = 0.5*g_volumeTotal;
let g_volumeSound = 0.5*g_volumeTotal;

function playSound(sound, volume=1) {
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play();
}


let g_camera = {
    x: g_screenWidth * 0.5 - G_PLAYER_START_X * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_x * (1-G_CAMERA_CENTER_PERCENT),
    y: g_screenHeight * 0.5 - G_PLAYER_START_Y * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_y * (1-G_CAMERA_CENTER_PERCENT),
    shakeEnergy: 0
}

let g_player = {};

let g_unlocks = {};

let g_buttonsList = [];

let g_inCombat = false;

function setTimeDialation(newTimeDialation) {
    console.log(newTimeDialation);
    g_timeDialation = newTimeDialation;
    g_invTimeDialation = 1/newTimeDialation;
    bgm.outOfCombat.playbackRate = newTimeDialation;
    bgm.inCombat.playbackRate = newTimeDialation;
}

function resetGame() {
    
    bgm.outOfCombat.volume = g_volumeMusic;
    bgm.outOfCombat.currentTime = 0;
    bgm.outOfCombat.loop = true;
    bgm.outOfCombat.playbackRate = g_timeDialation;
                
    bgm.inCombat.volume = 0;
    bgm.inCombat.currentTime = 0;
    bgm.inCombat.loop = true;
    bgm.inCombat.playbackRate = g_timeDialation;
    
    g_titleAlpha = 1;
    
    g_patternInstances = [];
    g_patternInstanceIDs = 0;
    g_enemyInstances = [];
    g_enemyInstanceIDs = 0;
    g_playerBulletInstances = [];
    g_player = new Player(G_PLAYER_START_X, G_PLAYER_START_Y, G_PLAYER_START_VX, G_PLAYER_START_VY);
    g_boss_ptr = undefined;
    resetStats();
    g_timeline = [
        new Event(g_currentTime+3000 * g_invTimeDialation, createSpawnEnemyMethod(ENEMY_TYPE_1, 6000, true)),
        /*new Event(g_currentTime+3000, () => {
            g_screenCenterFocus_x += g_screenWidth;
        })*/
    ];
    g_nextEvent_ptr = g_timeline.remove(0);
    
    bgm.outOfCombat.play();
    bgm.inCombat.play();
}

function resetStats(stats=g_stats) {
    g_stats.iTimeUsed = 0;
    g_stats.damageDealt = 0;
};
