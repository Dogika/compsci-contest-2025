function Weapon(name, firerate, defaultWeapon=false) {
    this.name = name;
    this.firerate = firerate;
    this.lastUsed = -1; //timestamp
    g_unlocks[name] = defaultWeapon;
}
