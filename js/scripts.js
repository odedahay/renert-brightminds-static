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

const testimonialsViewport = document.querySelector(".testimonials__viewport");

if (window.Swiper && testimonialsViewport) {
    new Swiper(testimonialsViewport, {
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        centeredSlides: true,
        grabCursor: true,
        initialSlide: 1,
        loop: true,
        pagination: {
            clickable: true,
            el: ".testimonials__pagination",
        },
        slidesPerView: "auto",
        spaceBetween: 25,
        speed: 550,
    });
}

document.querySelectorAll(".faq-item__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const item = trigger.closest(".faq-item");
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        if (!item) {
            return;
        }

        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
    });
});

if (navToggle && navMenu) {
    const navToggleLabel = navToggle.querySelector(".nav__toggle-label");
    const setMobileMenuState = (isOpen) => {
        navMenu.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));

        if (navToggleLabel) {
            navToggleLabel.textContent = isOpen ? "Close" : "Menu";
        }
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") !== "true";
        setMobileMenuState(isOpen);
    });

    navMenu.addEventListener("click", (event) => {
        if (event.target.closest(".nav__link, .nav__portal")) {
            setMobileMenuState(false);
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
