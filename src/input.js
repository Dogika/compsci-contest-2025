function keyDown(e) {
    let lowerKeyse = e.key.toLowerCase();
    if (!g_keyboard[lowerKeyse])
        g_trigger[lowerKeyse] = true;
    g_keyboard[lowerKeyse] = true;
}

function keyUp(e) {
    g_keyboard[e.key.toLowerCase()] = false;
}

function mouseEvent(e) {
    let canvas = document.getElementById("canvas");
    let bounds = canvas.getBoundingClientRect();
    
    g_mouse.x = e.pageX - bounds.left; // - scrollX;
    g_mouse.y = e.pageY - bounds.top; // - scrollY;
    g_mouse.x *= canvas.width/bounds.width; // rescale mouse coordinates to canvas pixels
    g_mouse.y *= canvas.height/bounds.height;
    
     if (e.type === "mousedown") {
        if (e.button === 0) {
            g_mouse.down = true;
        } else {
            g_mouse.down2 = true;
        }
    } else if (e.type === "mouseup") {
        if (e.button === 0) {
            g_mouse.down = false;
        } else {
            g_mouse.down2 = false;
        }
        for(let i = 0; i < g_buttonsList.length; i++){
            checkIfButtonClicked(g_buttonsList[i]);   
        }
    }
}

function getControl(controlType) {
    
    if (controlType == "moveUp")    return g_keyboard["w"];
    if (controlType == "moveLeft")  return g_keyboard["a"];
    if (controlType == "moveDown")  return g_keyboard["s"];
    if (controlType == "moveRight") return g_keyboard["d"];
    if (controlType == "pistol")    return g_keyboard["1"]; 
    if (controlType == "shotgun")   return g_keyboard["2"]; 
    if (controlType == "nailgun")   return g_keyboard["3"];
    if (controlType == "laser")     return g_keyboard["4"];
    if (controlType == "dash")      return g_keyboard[" "];
    if (controlType == "shoot")     return g_mouse.down;
    if (controlType == "fist")      return g_keyboard["f"];
    if (controlType == "quit")      return g_keyboard["`"];
    if (controlType == "menu")      return g_keyboard["Escape"];
    if (controlType == "alt")       return g_mouse.down2 || g_keyboard["e"];
    
    throw new Error("CustomError: controlType '"+controlType+"' not registered!");
}
