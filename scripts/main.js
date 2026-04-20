let navMenu = document.querySelector(`nav`);
let menuTrigger = document.querySelector(`#js-triggers li:first-child a`);
let modalTrigger = document.querySelector(`#js-triggers li:nth-child(2) a`);
let modalPanel = document.querySelector(`.modal-panel`);

let breakpoint = 736;
let isDesktop = window.innerWidth >= breakpoint;
