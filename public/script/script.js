const header = document.querySelector("header");
const button = document.querySelector(".menu-button");
const open = document.querySelector(".open-button");

function toggleMenu() {
    button.addEventListener("click", () => {
        button.classList.toggle("active");       
        const isActive = header.classList.toggle("menu-active");
      
        if (isActive) {
            open.setAttribute("aria-expanded", "true");
        } else {
            open.setAttribute("aria-expanded", "false");
        };
    });
};

function escapeMenu() {
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && header.classList.contains("menu-active")) {
			header.classList.remove("menu-active");
            button.classList.remove("active");
			open.setAttribute("aria-expanded", "false");
		};
	});
};

document.addEventListener("DOMContentLoaded", () => {
	toggleMenu();
	escapeMenu();
});