let bgMusic; 
export function showStart(container, switchScreen) {
    // 👇 شغّل الموسيقى مرة واحدة فقط
    if (!bgMusic) {
        bgMusic = new Audio('assets/sounds/background_music.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.4;
        bgMusic.play();
    }

    const wrap = document.createElement('section');
    wrap.className = 'screen';

    // 👇 إعدادات الخلفية
    wrap.style.width = '1280px';
    wrap.style.height = '720px';
    wrap.style.backgroundImage = 'url(assets/sprites/backgrounds/start_bckgnd3.png)';
    wrap.style.backgroundColor = '#3d291d';       
    wrap.style.backgroundSize = 'cover';
    wrap.style.backgroundPosition = 'center';
    wrap.style.backgroundRepeat = 'no-repeat';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.justifyContent = 'center';
    wrap.style.alignItems = 'center';
    wrap.style.textAlign = 'center';
    wrap.style.color = 'white';
    wrap.style.fontFamily = 'monospace';

    wrap.innerHTML = `
        <p>Press Start to begin!</p>
    `;

    // 👇 زر Start Game بخلفية صورة
    const btn = document.createElement('button');
    btn.textContent = ''; // نخلي النص فارغ عشان تظهر الصورة فقط
    btn.onclick = () => switchScreen('game');

    // حجم الزر (تعديل حسب حجم الصورة)
    btn.style.width = '200px';
    btn.style.height = '80px';

    // خلفية الزر
    btn.style.backgroundImage = "url('assets/sprites/buttons/start_btn.png')";
    btn.style.backgroundSize = 'cover';
    btn.style.backgroundColor = 'transparent'; // اجعل الخلفية شفافة
    btn.style.backgroundPosition = 'center';
    btn.style.backgroundRepeat = 'no-repeat';

    // إزالة الحدود الافتراضية
    btn.style.border = 'none';
    btn.style.outline = 'none';
    btn.style.cursor = 'pointer';

    // تأثير عند المرور بالماوس
    btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.2)');
    btn.addEventListener('mouseleave', () => btn.style.filter = 'brightness(1)');

    wrap.appendChild(btn);
    container.appendChild(wrap);
}