export function showFail(container, switchScreen) {
    const wrap = document.createElement('section');
    wrap.className = 'screen';
    wrap.innerHTML = `<h1>Challenge Failed 😵</h1><p>Try again!</p>`;
    const retry = document.createElement('button');
    retry.textContent = 'Retry';
    retry.onclick = () => switchScreen('game');
    const menu = document.createElement('button');
    menu.textContent = 'Back to Menu';
    menu.className = 'alt';
    menu.onclick = () => switchScreen('start');
    wrap.append(retry, menu);
    container.appendChild(wrap);
}
