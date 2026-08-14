const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");
const nav = document.querySelector(".nav");
const announcement = document.querySelector(".announcement");

if (nav) {
    const updateStickyNav = () => {
        const stickyOffset = announcement ? announcement.offsetHeight : 0;
        nav.classList.toggle("is-sticky", window.scrollY > stickyOffset);
    };

    updateStickyNav();
    window.addEventListener("scroll", updateStickyNav, { passive: true });
}

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.addEventListener("click", (event) => {
        if (event.target.closest(".nav__link, .nav__portal")) {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

document.querySelectorAll("[data-review-copy]").forEach((copy) => {
    const card = copy.closest(".review-card");
    const button = card ? card.querySelector(".review-card__more") : null;

    if (!button) {
        return;
    }

    copy.classList.add("is-collapsed");

    button.addEventListener("click", () => {
        const isCollapsed = copy.classList.toggle("is-collapsed");
        button.textContent = isCollapsed ? "Continue Reading" : "Show Less";
    });
});
