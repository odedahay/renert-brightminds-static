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

document.querySelectorAll(".contact-form").forEach((contactForm) => {
    const panels = Array.from(contactForm.querySelectorAll("[data-form-step]"));
    const indicators = Array.from(contactForm.querySelectorAll("[data-step-indicator]"));
    const nextButton = contactForm.querySelector("[data-next-step]");
    const previousButton = contactForm.querySelector("[data-previous-step]");
    const status = contactForm.querySelector(".contact-form__status");

    const getCurrentStep = () => Number(contactForm.dataset.currentStep || "1");

    const setStep = (step) => {
        contactForm.dataset.currentStep = String(step);

        panels.forEach((panel) => {
            const isActive = Number(panel.dataset.formStep) === step;

            panel.hidden = !isActive;
            panel.classList.toggle("is-active", isActive);
            panel.setAttribute("aria-hidden", String(!isActive));

            panel.querySelectorAll("input, select, textarea").forEach((control) => {
                control.disabled = !isActive;
            });
        });

        indicators.forEach((indicator) => {
            const indicatorStep = Number(indicator.dataset.stepIndicator);
            const isComplete = indicatorStep < step;
            const isActive = indicatorStep === step;

            indicator.classList.toggle("contact-form__step--complete", isComplete);
            indicator.classList.toggle("contact-form__step--active", isActive);
            indicator.classList.toggle("contact-form__step--inactive", indicatorStep > step);

            if (isActive) {
                indicator.setAttribute("aria-current", "step");
            } else {
                indicator.removeAttribute("aria-current");
            }
        });

        if (status) {
            status.textContent = "";
        }
    };

    const validateStep = (step) => {
        const panel = contactForm.querySelector(`[data-form-step="${step}"]`);

        if (!panel) {
            return true;
        }

        const invalidControl = Array.from(panel.querySelectorAll("input, select, textarea")).find((control) => {
            return !control.checkValidity();
        });

        if (invalidControl) {
            invalidControl.reportValidity();
            return false;
        }

        return true;
    };

    if (panels.length > 0) {
        setStep(getCurrentStep());
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            const currentStep = getCurrentStep();

            if (validateStep(currentStep)) {
                setStep(currentStep + 1);
            }
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            setStep(Math.max(1, getCurrentStep() - 1));
        });
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateStep(getCurrentStep())) {
            return;
        }

        if (contactForm.dataset.thankYouUrl) {
            window.location.href = contactForm.dataset.thankYouUrl;
            return;
        }

        contactForm.reset();

        if (panels.length > 0) {
            setStep(1);
        }

        if (status) {
            status.textContent = "Thanks. We received your inquiry and will contact you soon.";
        }
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
