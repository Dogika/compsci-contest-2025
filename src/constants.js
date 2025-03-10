const g_collide = true;

const G_X = 0;
const G_Y = 1;
const G_Z = 2;

const G_X_AXIS = [1, 0, 0];
const G_Y_AXIS = [0, 1, 0];
const G_Z_AXIS = [0, 0, 1];

const G_FARAWAY = 10e6;

const G_PLAYER_SMEAR_PERCENT = 0.6;
const G_PLAYER_BASE_SPEED = 0.15;
const G_PLAYER_MAX_STAMINA = 3;
const G_PLAYER_DASH_MULTIPLIER = 7;
const G_COLOR_WALL = "#C0C0C0";
const G_COLOR_FLOOR = "#303030";
const G_CAMERA_DECAY_SPEED = 0.008;
const G_CAMERA_CENTER_PERCENT = 0.3;

const G_SHOTGUN_SHOTS = 7;
const G_SHOTGUN_SPREAD = Math.PI*0.3;
const G_SHOTGUN_SPEED_RANGE = 0.01;
const G_SHOTGUN_SPEED_SHIFT = 0.01;
const G_SHOTGUN_BULLET_DIFFERENCE = 0.6;
const G_NAILGUN_SPREAD = Math.PI*0.25;
const G_BULLET_FRICTION = 0.001;

const g_screenWidth = window.innerHeight*0.95;
const g_screenHeight = window.innerHeight*0.95;
setSize(g_screenWidth, g_screenHeight); //this game was made for 400x400

const G_SCREEN_CENTER_FOCUS_START_X = 0;
const G_SCREEN_CENTER_FOCUS_START_Y = 0;

const G_BULLET_BARRIER_X = g_screenWidth;
const G_BULLET_BARRIER_Y = g_screenHeight;

const G_WALL_THICKNESS = 0;

const G_TARGET_MOUSE = true;

const G_PLAYER_START_X = 0;
const G_PLAYER_START_Y = g_screenHeight*0.4;
let difference_y = G_SCREEN_CENTER_FOCUS_START_Y - G_PLAYER_START_Y;
let topLeft = G_PLAYER_START_X - G_SCREEN_CENTER_FOCUS_START_X + difference_y < 0;
let topRight = G_SCREEN_CENTER_FOCUS_START_X - G_PLAYER_START_X + difference_y < 0;
const G_PLAYER_START_VX = 0.00000001 * (topLeft - topRight);
const G_PLAYER_START_VY = 0.00000001 * (1 - topLeft - topRight);

const G_PREFERED_SCALAR = g_screenHeight/500;

const G_BOSS_MAX_HEALTH = 8000;
const G_BOSS_NAME_0 = "SUN, THE PURITY OF HEAVEN";
const G_LEVEL_TITLE_0 = "KILL THE SUN";
const G_LEVEL_SUBTITLE_0 = "PRELUDE /// FIRST";

const SPONGEBOB_SPRITE = new Image();
SPONGEBOB_SPRITE.src = "https://codehs.com/uploads/cd4f63027e37b2dda278f63ff52a08ee";
const G_SPONGEBOB_WIDTH = SPONGEBOB_SPRITE.naturalWidth * 0.12;
const G_SPONGEBOB_HEIGHT = SPONGEBOB_SPRITE.naturalHeight * 0.12;

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];   
};

function mod(n, m) {
  return ((n % m) + m) % m;
}
