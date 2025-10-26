// src/js/game.js

export function showGame(container, switchScreen) {
    // -------- Config --------
    const CANVAS_W = 1280, CANVAS_H = 720;     // 16:9 desktop
    const CENTER_X = CANVAS_W / 2, PIZZA_Y = 420;

    const LAYER_SIZE = 520;                     // how big each ingredient layer is drawn
    const ASSETS = {
        background: "assets/sprites/backgrounds/game_bckgnd.png",
        ingredients: {
            dough: "assets/sprites/ingredients/dough.png",
            tomato_sauce: "assets/sprites/ingredients/tomato_sauce.png",
            cheese: "assets/sprites/ingredients/cheese.png",
            pepperoni: "assets/sprites/ingredients/pepperoni.png",
            green_bell_peppers: "assets/sprites/ingredients/green_bell_peppers.png",
            olives: "assets/sprites/ingredients/olives.png",
            red_onions: "assets/sprites/ingredients/red_onions.png",
        },
        buttons: {
            tomato_sauce: "assets/sprites/buttons/tomato_sauce_btn.png",
            cheese: "assets/sprites/buttons/cheese_btn.png",
            pepperoni: "assets/sprites/buttons/pepperoni_btn.png",
            green_bell_peppers: "assets/sprites/buttons/green_bell_peppers_btn.png",
            olives: "assets/sprites/buttons/olives_btn.png",
            red_onions: "assets/sprites/buttons/red_onion_btn.png",
            serve: "assets/sprites/buttons/serve_btn.png",
            throw: "assets/sprites/buttons/throw_btn.png",
        },
        // Order cards (top-right)
        orders: {
            margarita: "assets/sprites/orders/margarita_pizza.png",
            veggie: "assets/sprites/orders/veggie_pizza.png",
            pepperoni: "assets/sprites/orders/pepperoni_pizza.png",
        },
    };

    // Order recipes (edit if you like)
    const RECIPES = {
        margarita: ["tomato_sauce", "cheese"],
        veggie: ["tomato_sauce", "cheese", "green_bell_peppers", "olives", "red_onions"],
        pepperoni: ["tomato_sauce", "cheese", "pepperoni"],
    };

    // -------- DOM scaffold --------
    container.style.position = "relative";

    const topBar = document.createElement("div");
    topBar.style.position = "absolute";
    topBar.style.left = "0";
    topBar.style.right = "0";
    topBar.style.top = "12px";
    topBar.style.display = "flex";
    topBar.style.justifyContent = "center";
    topBar.style.gap = "12px";
    container.appendChild(topBar);

    // Bottom horizontal ingredient dock
    const leftDock = document.createElement("div");
    leftDock.style.position = "absolute";
    leftDock.style.left = "0";
    leftDock.style.right = "0";
    leftDock.style.bottom = "8px";          // closer to bottom
    leftDock.style.display = "flex";
    leftDock.style.flexDirection = "row";
    leftDock.style.justifyContent = "center";
    leftDock.style.alignItems = "center";
    leftDock.style.gap = "10px";            // closer together
    leftDock.style.zIndex = "2";
    container.appendChild(leftDock);

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.imageRendering = "pixelated";
    canvas.style.border = "2px solid #3a2a1a";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.imageSmoothingEnabled = false;

    // -------- State --------
    const images = {}; // key -> HTMLImageElement
    const placed = new Set(); // which toppings are currently ON the pizza
    let currentOrder = pickRandom(Object.keys(RECIPES));
    let bgReady = false;

    // -------- Helpers --------
    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => { console.error("❌ Failed to load:", src); resolve(null); };
            img.src = src;
        });
    }

    async function preload() {
        // background
        images.background = await loadImage(ASSETS.background).catch(() => null);
        bgReady = !!images.background;

        // ingredients
        for (const [name, path] of Object.entries(ASSETS.ingredients)) {
            images[`ing.${name}`] = await loadImage(path).catch(() => null);
        }

        // orders (cards)
        for (const [name, path] of Object.entries(ASSETS.orders)) {
            images[`order.${name}`] = await loadImage(path).catch(() => null);
        }

        render();
    }

    // bigger action buttons (Serve/Throw), slightly smaller ingredient buttons
    function buttonWithIcon(key, label, onClick) {
        const isAction = (key === "serve" || key === "throw");
        const size = isAction ? 112 : 104;   // Serve/Throw bigger; ingredients slightly bigger

        const wrap = document.createElement("button");
        wrap.style.width = size + "px";
        wrap.style.height = size + "px";
        wrap.style.border = "0";
        wrap.style.borderRadius = "12px";
        wrap.style.padding = "0";                 // no inner padding
        wrap.style.background = "transparent";    // transparent background
        wrap.style.cursor = "pointer";
        wrap.style.boxShadow = "none";
        wrap.title = label;

        const iconPath = ASSETS.buttons[key];
        if (iconPath) {
            const img = document.createElement("img");
            img.src = iconPath;
            img.alt = label;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.imageRendering = "pixelated";
            img.style.borderRadius = "10px";
            img.draggable = false;
            wrap.appendChild(img);
        } else {
            wrap.textContent = label;
            wrap.style.color = "#fff";
            wrap.style.font = isAction ? "16px monospace" : "14px monospace";
        }

        // keep audio assets intact
        const buttonSound = new Audio('assets/sounds/botton_sound.wav');
        wrap.addEventListener("click", (e) => {
            buttonSound.currentTime = 0;
            buttonSound.play();
            onClick(e);
        });
        return wrap;
    }

    function toggleTopping(name) {
        if (placed.has(name)) {
            placed.delete(name);
        } else {
            placed.add(name);
            if (name === "tomato_sauce") {
                const tomatoSauceSound = new Audio('assets/sounds/sauce_sound.wav');
                tomatoSauceSound.currentTime = 0;
                tomatoSauceSound.play();
            } else if (name === "cheese") {
                const cheeseSound = new Audio('assets/sounds/sauce_sound.wav');
                cheeseSound.currentTime = 0;
                cheeseSound.play();
            }
        }
        render();
    }

    function resetPizza() {
        placed.clear();
        render();
    }

    function servePizza() {
        const need = RECIPES[currentOrder] || [];
        const ok =
            need.every((t) => placed.has(t)) && need.length === placed.size;

        // Switch screens (you already have success/fail pages)
        switchScreen(ok ? "success" : "fail");
    }

    function drawCentered(img, y, size) {
        if (!img) return;
        const x = Math.round(CENTER_X - size / 2);
        ctx.drawImage(img, x, Math.round(y - size / 2), size, size);
    }

    // Draw the order image card at the top-right corner (slightly more on top)
    function drawOrderCardTopRight(img) {
        if (!img) return;
        const marginX = 10;
        const marginY = 0;                 // closer to the top edge
        const targetW = 260;
        const ratio = img.height / img.width || 1;
        const targetH = Math.round(targetW * ratio);

        const x = CANVAS_W - marginX - targetW;
        const y = marginY;
        ctx.drawImage(img, x, y, targetW, targetH);
    }

    function render() {
        // background
        if (bgReady) {
            ctx.drawImage(images.background, 0, 0, CANVAS_W, CANVAS_H);
        } else {
            ctx.fillStyle = "#1b1b1f";
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // ---- Pizza stack ----
        const DOUGH_SIZE = LAYER_SIZE;               // full size for dough
        const BASE_TOPPING_SIZE = LAYER_SIZE * 0.70; // slightly smaller toppings

        // Dough always drawn first
        drawCentered(images["ing.dough"], PIZZA_Y, DOUGH_SIZE);

        // Sauce and cheese first (slightly smaller)
        if (placed.has("tomato_sauce")) drawCentered(images["ing.tomato_sauce"], PIZZA_Y, BASE_TOPPING_SIZE);
        if (placed.has("cheese")) drawCentered(images["ing.cheese"], PIZZA_Y, BASE_TOPPING_SIZE);

        // Other toppings
        const others = ["pepperoni", "green_bell_peppers", "olives", "red_onions"];
        for (const t of others) {
            if (placed.has(t)) drawCentered(images[`ing.${t}`], PIZZA_Y, BASE_TOPPING_SIZE);
        }

        // ---- HUD ----
        drawOrderCardTopRight(images[`order.${currentOrder}`]);  // order card image

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px monospace";
        // (Order text removed; order is shown by the image)
        ctx.fillText(`Toppings: ${Array.from(placed).join(", ") || "—"}`, 20, 54);
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // -------- UI buttons --------
    // Top-bar: Serve / Throw
    topBar.appendChild(
        buttonWithIcon("serve", "Serve", servePizza)
    );
    topBar.appendChild(
        buttonWithIcon("throw", "Throw", () => {
            resetPizza();
        })
    );

    // Bottom Dock: ingredient buttons (toggle)
    const ingredientOrder = [
        "tomato_sauce",
        "cheese",
        "pepperoni",
        "green_bell_peppers",
        "olives",
        "red_onions",
    ];
    ingredientOrder.forEach((name) => {
        const btn = buttonWithIcon(name, name.replaceAll("_", " "), () => toggleTopping(name));
        leftDock.appendChild(btn);
    });

    // -------- Boot --------
    preload();
}
