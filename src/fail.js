// src/js/fail.js

export function showFail(container, switchScreen) {
    const CANVAS_W = 1280, CANVAS_H = 720;
    const bgPath = "assets/sprites/backgrounds/fail_bckgnd.png";
    const failTextPath = "assets/sprites/text/fail.png"; // fail text image

    const wrap = document.createElement("section");
    wrap.className = "screen";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.alignItems = "center";
    wrap.style.flexDirection = "column";
    wrap.style.position = "relative";
    container.appendChild(wrap);

    // 🔊 Play fail sound
    const failSound = new Audio("assets/sounds/failure_sound2.wav");
    failSound.currentTime = 0;
    failSound.play();

    // 🎨 Background canvas
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.border = "2px solid #3a2a1a";
    wrap.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = bgPath;
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    };

    // 🧾 Fail image (above buttons)
    const failText = document.createElement("img");
    failText.src = failTextPath;
    failText.alt = "Challenge Failed";
    failText.style.position = "absolute";
    failText.style.top = "0px"; // slightly above buttons
    failText.style.left = "50%";
    failText.style.transform = "translateX(-50%)";
    failText.style.width = "520px";
    failText.style.imageRendering = "pixelated";
    failText.style.pointerEvents = "none";
    failText.draggable = false;
    wrap.appendChild(failText);

    // ⚙️ Buttons container
    const msg = document.createElement("div");
    msg.style.position = "absolute";
    msg.style.top = "70%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.display = "flex";
    msg.style.flexDirection = "column";
    msg.style.alignItems = "center";
    msg.style.gap = "0px"; // 🔥 no gap between buttons
    wrap.appendChild(msg);

    // 🔁 Retry button (image-based)
    const retry = document.createElement("button");
    retry.style.width = "270px";
    retry.style.height = "150px";
    retry.style.background = "transparent";
    retry.style.border = "none";
    retry.style.cursor = "pointer";
    retry.style.padding = "0";

    const retryImg = document.createElement("img");
    retryImg.src = "assets/sprites/buttons/retry_btn.png";
    retryImg.alt = "Retry";
    retryImg.style.width = "100%";
    retryImg.style.height = "100%";
    retryImg.style.imageRendering = "pixelated";
    retryImg.draggable = false;
    retry.appendChild(retryImg);

    retry.onclick = () => switchScreen("game");

    // 🏠 Back to Menu button (image-based)
    const menu = document.createElement("button");
    menu.style.width = "270px";
    menu.style.height = "150px";
    menu.style.background = "transparent";
    menu.style.border = "none";
    menu.style.cursor = "pointer";
    menu.style.padding = "0";

    const menuImg = document.createElement("img");
    menuImg.src = "assets/sprites/buttons/back_btn.png";
    menuImg.alt = "Back to Menu";
    menuImg.style.width = "100%";
    menuImg.style.height = "100%";
    menuImg.style.imageRendering = "pixelated";
    menuImg.draggable = false;
    menu.appendChild(menuImg);

    menu.onclick = () => switchScreen("start");

    // Add buttons to layout
    msg.append(retry, menu);
}
