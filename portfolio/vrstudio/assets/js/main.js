//Open or Close Hamburger Menu on Click
const menuToggler = document.querySelector(".menu-toggle");
const body = document.querySelector("body");
menuToggler.addEventListener("click", () => body.classList.toggle("open"));
