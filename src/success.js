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
    wrap.style.textAlign = 'center';
    wrap.style.color = 'white';
    wrap.innerHTML = `<h1>Success! 🎉</h1><p>Great job, chef.</p>`;
    const again = document.createElement('button');
    again.textContent = 'Play Again';
    again.onclick = () => switchScreen('game');
    const menu = document.createElement('button');
    menu.textContent = 'Back to Menu';
    menu.className = 'alt';
    menu.onclick = () => switchScreen('start');
    wrap.append(again, menu);
    container.appendChild(wrap);
}
