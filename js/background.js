'use strict';
const wrap = document.querySelector('.wrap');

onload = () => {
    const backgrounds = ['../assets/img/tanks/60tp.png', '../assets/img/tanks/is7.png', '../assets/img/tanks/kranvagn.png', '../assets/img/tanks/maus.png', '../assets/img/tanks/super.png', '../assets/img/tanks/type5.png'];
    loaderToggle(loader, 500);
    wrap.style.backgroundImage = `url(${backgrounds[randomNum()]})`;
}

const randomNum = num => {
    num = Math.floor(Math.random() * 6);
    return num;
}