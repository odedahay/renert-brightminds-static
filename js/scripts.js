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

const faqSearchInput = document.querySelector(".faq-search__input");
const faqItems = document.querySelectorAll(".faq-item");
const faqCategories = document.querySelectorAll(".faq-category");
const faqCategoriesGroup = document.querySelector(".faq-categories");
const faqEmptyMessage = document.querySelector(".faq-accordion__empty");

const closeFaqItem = (item) => {
    const trigger = item.querySelector(".faq-item__trigger");

    item.classList.remove("is-open");

    if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
    }
};

const applyFaqFilters = () => {
    const activeCategory = document.querySelector(".faq-category.is-active");
    const selectedCategory = activeCategory ? activeCategory.dataset.faqCategory : "";
    const query = faqSearchInput ? faqSearchInput.value.trim().toLowerCase() : "";

    if (faqCategoriesGroup) {
        faqCategoriesGroup.classList.toggle("is-hidden", Boolean(query));
    }

    let visibleCount = 0;

    faqItems.forEach((item) => {
        const tags = item.dataset.faqTags ? item.dataset.faqTags.split(" ") : [];
        const itemText = item.textContent.toLowerCase();
        const matchesCategory = selectedCategory ? tags.includes(selectedCategory) : true;
        const matchesSearch = query ? itemText.includes(query) : true;
        const shouldShow = matchesCategory && matchesSearch;

        item.classList.toggle("is-hidden", !shouldShow);

        if (shouldShow) {
            visibleCount += 1;
        }

        if (!shouldShow) {
            closeFaqItem(item);
        }
    });

    if (faqEmptyMessage) {
        faqEmptyMessage.classList.toggle("is-visible", visibleCount === 0);
        faqEmptyMessage.textContent = query ? `No matching questions found - ${query}` : "No matching questions found.";
    }
};

faqCategories.forEach((category) => {
    category.addEventListener("click", () => {
        faqCategories.forEach((activeCategory) => {
            activeCategory.classList.remove("is-active");
        });

        category.classList.add("is-active");
        applyFaqFilters();
    });
});

if (faqSearchInput) {
    faqSearchInput.addEventListener("input", applyFaqFilters);
}

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
