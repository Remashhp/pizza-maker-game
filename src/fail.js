export function showFail(container, switchScreen) {
    const CANVAS_W = 1280, CANVAS_H = 720;
    const bgPath = "assets/sprites/backgrounds/fail_bckgnd.png";

    const wrap = document.createElement("section");
    wrap.className = "screen";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.alignItems = "center";
    wrap.style.flexDirection = "column";
    container.appendChild(wrap);

    // Play fail sound
    const failSound = new Audio("assets/sounds/failure_sound2.wav");
    failSound.play();

    // Canvas للخلفية
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
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    };

    // رسالة الفشل مع ترتيب عمودي للأزرار
    const msg = document.createElement("div");
    msg.innerHTML = `<h1>Challenge Failed 😵</h1><p>Try again!</p>`;
    msg.style.position = "absolute";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.textAlign = "center";
    msg.style.color = "white";
    msg.style.fontFamily = "monospace";
    msg.style.display = "flex";           
    msg.style.flexDirection = "column";   
    msg.style.alignItems = "center";      
    msg.style.gap = "10px";               

    wrap.appendChild(msg);

    // زر Retry
    const retry = document.createElement("button");
    retry.textContent = "Retry";
    retry.onclick = () => switchScreen("game");
    retry.style.width = "150px";          
    retry.style.height = "50px";

    // زر Back to Menu
    const menu = document.createElement("button");
    menu.textContent = "Back to Menu";
    menu.className = "alt";
    menu.onclick = () => switchScreen("start");
    menu.style.width = "150px";
    menu.style.height = "50px";

    // إضافة الزرين للـ div
    msg.append(retry, menu);
}