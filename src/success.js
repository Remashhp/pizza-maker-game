// src/js/success.js

export function showSuccess(container, switchScreen) {
    const wrap = document.createElement('section');
    wrap.className = 'screen';
    wrap.style.width = '1280px';
    wrap.style.height = '720px';
    wrap.style.backgroundImage = "url('assets/sprites/backgrounds/success_bckgnd.png')";
    wrap.style.backgroundSize = 'cover';
    wrap.style.backgroundPosition = 'center';
    wrap.style.backgroundRepeat = 'no-repeat';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.justifyContent = 'center';
    wrap.style.alignItems = 'center';
    wrap.style.position = 'relative';
    wrap.style.textAlign = 'center';
    wrap.style.color = 'white';
    container.appendChild(wrap);

    // ---------- Success Sound ----------
    const successSound = new Audio('assets/sounds/successful_sound.wav');
    successSound.currentTime = 0;
    successSound.play();

    // ---------- Success Text Image ----------
    const successText = document.createElement('img');
    successText.src = "assets/sprites/text/success.png";
    successText.alt = "Success!";
    successText.style.position = "absolute";
    successText.style.top = "50px"; // just above buttons
    successText.style.left = "50%";
    successText.style.transform = "translateX(-50%)";
    successText.style.width = "520px";
    successText.style.imageRendering = "pixelated";
    successText.style.pointerEvents = "none";
    successText.draggable = false;
    wrap.appendChild(successText);

    // ---------- Buttons Container ----------
    const msg = document.createElement("div");
    msg.style.position = "absolute";
    msg.style.top = "70%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.display = "flex";
    msg.style.flexDirection = "column";
    msg.style.alignItems = "center";
    msg.style.gap = "0px"; // no space between buttons
    wrap.appendChild(msg);

    // ---------- Play Again Button ----------
    const again = document.createElement('button');
    again.style.width = '270px';
    again.style.height = '150px';
    again.style.background = "transparent";
    again.style.border = "none";
    again.style.cursor = "pointer";
    again.style.padding = "0";

    const againImg = document.createElement('img');
    againImg.src = "assets/sprites/buttons/play_again_btn.png";
    againImg.alt = "Play Again";
    againImg.style.width = "100%";
    againImg.style.height = "100%";
    againImg.style.imageRendering = "pixelated";
    againImg.draggable = false;
    again.appendChild(againImg);

    again.onclick = () => switchScreen('game');

    // ---------- Back to Menu Button ----------
    const menu = document.createElement('button');
    menu.style.width = '270px';
    menu.style.height = '150px';
    menu.style.background = "transparent";
    menu.style.border = "none";
    menu.style.cursor = "pointer";
    menu.style.padding = "0";

    const menuImg = document.createElement('img');
    menuImg.src = "assets/sprites/buttons/back_btn.png";
    menuImg.alt = "Back to Menu";
    menuImg.style.width = "100%";
    menuImg.style.height = "100%";
    menuImg.style.imageRendering = "pixelated";
    menuImg.draggable = false;
    menu.appendChild(menuImg);

    menu.onclick = () => switchScreen('start');

    // ---------- Add Buttons ----------
    msg.append(again, menu);
}
