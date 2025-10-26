export function showSuccess(container, switchScreen) {
    const wrap = document.createElement('section');
    wrap.className = 'screen';
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
