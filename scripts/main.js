let navMenu = document.querySelector(`nav`);
let menuTrigger = document.querySelector(`#js-triggers li:first-child a`);
let modalTrigger = document.querySelector(`#js-triggers li:nth-child(2) a`);
let modalPanel = document.querySelector(`.modal-panel`);

let breakpoint = 736;
let isDesktop = window.innerWidth >= breakpoint;

let toggleMenu = (event) => {
    event.preventDefault();
    if (window.innerWidth >= breakpoint) {
        navMenu.classList.toggle(`is-dropdown-active`);
    } else {
        navMenu.classList.toggle(`is-tray-active`);
    }
};

let toggleModal = (event) => {
    event.preventDefault();
    modalPanel.classList.add(`is-active`);
};

let closeModal = (event) => {
    let isBackgroundClick = event.target === modalPanel;
    let isEscapeKey = event.key === `Escape`;

    if (isBackgroundClick || isEscapeKey) {
        modalPanel.classList.remove(`is-active`);
    }
};

let handleResize = () => {
   let currentIsDesktop = window.innerWidth >= breakpoint;

    if (currentIsDesktop !== isDesktop) {
        navMenu.style.transition = `none`;

        navMenu.classList.remove(`is-dropdown-active`);
        navMenu.classList.remove(`is-tray-active`);
        modalPanel.classList.remove(`is-active`);
        isDesktop = currentIsDesktop;

        setTimeout(() => {
            navMenu.style.transition = ``;
        }, 50);
    }
};

menuTrigger.addEventListener(`click`, toggleMenu);
modalTrigger.addEventListener(`click`, toggleModal);
modalPanel.addEventListener(`click`, closeModal);
window.addEventListener(`keydown`, closeModal);
window.addEventListener(`resize`, handleResize);
