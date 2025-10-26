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
    topBar.style.gap = "10px";
    container.appendChild(topBar);

    const leftDock = document.createElement("div");
    leftDock.style.position = "absolute";
    leftDock.style.left = "16px";
    leftDock.style.top = "80px";
    leftDock.style.display = "grid";
    leftDock.style.gridTemplateColumns = "1fr";
    leftDock.style.gap = "10px";
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

        render();
    }

    function buttonWithIcon(key, label, onClick) {
        const wrap = document.createElement("button");
        wrap.style.width = "72px";
        wrap.style.height = "72px";
        wrap.style.border = "0";
        wrap.style.borderRadius = "10px";
        wrap.style.padding = "6px";
        wrap.style.background = "#2b2b2f";
        wrap.style.cursor = "pointer";
        wrap.style.boxShadow = "0 2px 0 #0008";
        wrap.title = label;

        const iconPath = ASSETS.buttons[key];
        if (iconPath) {
            const img = document.createElement("img");
            img.src = iconPath;
            img.alt = label;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.imageRendering = "pixelated";
            img.draggable = false;
            wrap.appendChild(img);
        } else {
            wrap.textContent = label;
            wrap.style.color = "#fff";
            wrap.style.font = "12px monospace";
        }

        wrap.addEventListener("click", onClick);
        return wrap;
    }

    function toggleTopping(name) {
        if (placed.has(name)) placed.delete(name);
        else placed.add(name);
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

    function render() {
        // background
        if (bgReady) {
            ctx.drawImage(images.background, 0, 0, CANVAS_W, CANVAS_H);
        } else {
            ctx.fillStyle = "#1b1b1f";
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // Dough always drawn first
        drawCentered(images["ing.dough"], PIZZA_Y, LAYER_SIZE);

        // Sauce and cheese get priority order
        if (placed.has("tomato_sauce")) drawCentered(images["ing.tomato_sauce"], PIZZA_Y, LAYER_SIZE);
        if (placed.has("cheese")) drawCentered(images["ing.cheese"], PIZZA_Y, LAYER_SIZE);

        // Other toppings (order is stable)
        const others = ["pepperoni", "green_bell_peppers", "olives", "red_onions"];
        for (const t of others) {
            if (placed.has(t)) drawCentered(images[`ing.${t}`], PIZZA_Y, LAYER_SIZE);
        }

        // HUD text
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px monospace";
        ctx.fillText(`Order: ${currentOrder}`, 20, 30);
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

    // Left Dock: ingredient buttons (toggle)
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
