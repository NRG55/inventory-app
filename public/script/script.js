const header = document.querySelector("header");
const openMenuButton = document.querySelector(".open-menu-button");
const openFilterButton = document.querySelector(".open-filter-button");
const filter = document.querySelector(".filter");
const searchForm = document.querySelector(".search-form");

function toggleMenu() {
    openMenuButton.addEventListener("click", () => {
        openMenuButton.classList.toggle("active");       
        const isActive = header.classList.toggle("menu-active");
      
        if (isActive) {
            openMenuButton.setAttribute("aria-expanded", "true");
        } else {
            openMenuButton.setAttribute("aria-expanded", "false");
        };
    });
};

function openFilter() {
    openFilterButton.addEventListener("click", () => {
        filter.classList.add("filter-active");
        searchForm.classList.add("search-form-active");          
        openFilterButton.setAttribute("aria-expanded", "true");       
    });
};

function escapeMenu() {   
	document.addEventListener("keydown", (e) => {     
		if (e.key === "Escape" && (header.classList.contains("menu-active") || filter.classList.contains("filter-active"))) {		
            header.classList.remove("menu-active");
            openMenuButton.classList.remove("active");
			openMenuButton.setAttribute("aria-expanded", "false");
            filter.classList.remove("filter-active");
            searchForm.classList.remove("search-form-active");          
            openFilterButton.setAttribute("aria-expanded", "false");
		};
	});
};

window.onresize = function () {
    let w = window.outerWidth;
    if (w > 768) {
        header.classList.remove("menu-active");
        openMenuButton.classList.remove("active");
        filter.classList.remove("filter-active");
        searchForm.classList.remove("search-form-active");          
        openFilterButton.setAttribute("aria-expanded", "false");
    };
};

document.addEventListener("DOMContentLoaded", () => {
	toggleMenu();
    openFilter();
	escapeMenu();
});