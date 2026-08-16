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

const resultsSection = document.querySelector(".results");
const resultOdometers = document.querySelectorAll(".results__odometer[data-count]");

if (resultsSection && resultOdometers.length) {
    const animateResults = () => {
        resultOdometers.forEach((odometer) => {
            const count = Number(odometer.dataset.count);

            odometer.textContent = window.Odometer ? String(count) : count.toLocaleString();
        });
    };

    if ("IntersectionObserver" in window) {
        const resultsObserver = new IntersectionObserver((entries, observer) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }

            animateResults();
            observer.disconnect();
        }, {
            threshold: 0.35,
        });

        resultsObserver.observe(resultsSection);
    } else {
        animateResults();
    }
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

document.querySelectorAll("[data-schedule-view]").forEach((scheduleView) => {
    const viewButtons = Array.from(scheduleView.querySelectorAll("[data-schedule-view-button]"));
    const gridView = scheduleView.querySelector(".schedule-calendar__grid-view");
    const listView = scheduleView.querySelector(".schedule-events");
    const calendarTable = scheduleView.querySelector(".schedule-calendar__table");
    const calendarMonth = scheduleView.querySelector(".schedule-calendar__month");
    const previousMonthButton = scheduleView.querySelector("[data-calendar-prev]");
    const nextMonthButton = scheduleView.querySelector("[data-calendar-next]");
    const popup = document.createElement("div");
    const popupPanel = document.createElement("div");
    const popupCloseButton = document.createElement("button");
    const popupTitle = document.createElement("h3");
    const popupEvents = document.createElement("div");
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const scheduleEvents = Array.from(scheduleView.querySelectorAll(".schedule-event[data-event-date]")).map((eventCard) => {
        const [year, month, day] = eventCard.dataset.eventDate.split("-").map(Number);
        const title = eventCard.querySelector(".schedule-event__title");

        return {
            card: eventCard,
            date: new Date(year, month - 1, day),
            title: title ? title.textContent.trim() : "Class",
        };
    });

    popup.className = "schedule-event-popup";
    popup.hidden = true;
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-modal", "true");

    popupPanel.className = "schedule-event-popup__panel";

    popupCloseButton.className = "schedule-event-popup__close";
    popupCloseButton.type = "button";
    popupCloseButton.setAttribute("aria-label", "Close event details");
    popupCloseButton.textContent = "x";

    popupTitle.className = "schedule-event-popup__title";
    popupTitle.id = "schedule-event-popup-title";
    popupEvents.className = "schedule-event-popup__events";
    popup.setAttribute("aria-labelledby", popupTitle.id);

    popupPanel.append(popupCloseButton, popupTitle, popupEvents);
    popup.append(popupPanel);
    scheduleView.append(popup);

    const getDateKey = (date) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    };

    const getInitialCalendarDate = () => {
        if (calendarMonth) {
            const [monthName, yearText] = calendarMonth.textContent.trim().split(" ");
            const monthIndex = monthNames.indexOf(monthName);
            const year = Number(yearText);

            if (monthIndex >= 0 && Number.isFinite(year)) {
                return new Date(year, monthIndex, 1);
            }
        }

        return scheduleEvents.length > 0 ? new Date(scheduleEvents[0].date.getFullYear(), scheduleEvents[0].date.getMonth(), 1) : new Date();
    };

    let visibleCalendarDate = getInitialCalendarDate();
    let lastFocusedCalendarEvent = null;

    const closeEventPopup = () => {
        popup.hidden = true;
        popupEvents.replaceChildren();

        if (lastFocusedCalendarEvent) {
            lastFocusedCalendarEvent.focus();
        }
    };

    const openEventPopup = (eventItems, trigger, date) => {
        if (eventItems.length === 0) {
            return;
        }

        popupEvents.replaceChildren();
        popupTitle.textContent = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            weekday: "long",
            year: "numeric",
        });

        eventItems.forEach((eventItem) => {
            const eventCard = eventItem.card.cloneNode(true);

            eventCard.removeAttribute("id");
            eventCard.classList.add("schedule-event--popup");
            popupEvents.append(eventCard);
        });

        popup.hidden = false;
        lastFocusedCalendarEvent = trigger;
        popupCloseButton.focus();
    };

    const renderCalendar = () => {
        if (!calendarTable || !calendarMonth) {
            return;
        }

        const year = visibleCalendarDate.getFullYear();
        const month = visibleCalendarDate.getMonth();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const eventsByDate = scheduleEvents.reduce((groupedEvents, eventItem) => {
            const eventKey = getDateKey(eventItem.date);

            if (!groupedEvents[eventKey]) {
                groupedEvents[eventKey] = [];
            }

            groupedEvents[eventKey].push(eventItem);
            return groupedEvents;
        }, {});
        const daysFragment = document.createDocumentFragment();

        calendarMonth.textContent = `${monthNames[month]} ${year}`;
        calendarTable.setAttribute("aria-label", `${monthNames[month]} ${year} calendar`);
        calendarTable.querySelectorAll(".schedule-calendar__day").forEach((dayCell) => {
            dayCell.remove();
        });

        for (let index = 0; index < 42; index += 1) {
            const dayDate = new Date(year, month, index - firstDayIndex + 1);
            const isCurrentMonth = dayDate.getMonth() === month;
            const dayCell = document.createElement("div");
            const dayNumber = document.createElement("span");
            const dayEvents = eventsByDate[getDateKey(dayDate)] || [];

            dayCell.className = "schedule-calendar__day";
            dayCell.setAttribute("aria-label", dayDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                weekday: "long",
                year: "numeric",
            }));

            if (!isCurrentMonth) {
                dayCell.classList.add("schedule-calendar__day--muted");
            }

            dayNumber.textContent = String(dayDate.getDate());
            dayCell.append(dayNumber);

            if (dayEvents.length > 0) {
                dayCell.classList.add("schedule-calendar__day--has-events");
                dayCell.dataset.eventDate = getDateKey(dayDate);
                dayCell.tabIndex = 0;
                dayCell.setAttribute("role", "button");
                dayCell.setAttribute("aria-label", `${dayCell.getAttribute("aria-label")}, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`);
            }

            dayEvents.forEach((eventItem) => {
                const eventLabel = document.createElement("span");

                eventLabel.className = "schedule-calendar__event-title";
                eventLabel.textContent = eventItem.title;
                dayCell.append(eventLabel);
            });

            daysFragment.append(dayCell);
        }

        calendarTable.append(daysFragment);
    };

    const setScheduleView = (selectedView) => {
        const isGridView = selectedView === "grid";

        scheduleView.dataset.scheduleView = selectedView;

        if (gridView) {
            gridView.hidden = !isGridView;
        }

        if (listView) {
            listView.hidden = isGridView;
        }

        viewButtons.forEach((viewButton) => {
            const isActive = viewButton.dataset.scheduleViewButton === selectedView;

            viewButton.classList.toggle("is-active", isActive);
            viewButton.setAttribute("aria-pressed", String(isActive));
        });
    };

    viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedView = button.dataset.scheduleViewButton || "grid";

            setScheduleView(selectedView);
        });
    });

    setScheduleView(scheduleView.dataset.scheduleView || "grid");

    if (previousMonthButton) {
        previousMonthButton.addEventListener("click", () => {
            visibleCalendarDate = new Date(visibleCalendarDate.getFullYear(), visibleCalendarDate.getMonth() - 1, 1);
            renderCalendar();
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener("click", () => {
            visibleCalendarDate = new Date(visibleCalendarDate.getFullYear(), visibleCalendarDate.getMonth() + 1, 1);
            renderCalendar();
        });
    }

    if (calendarTable) {
        const openDayCellEvents = (dayCell) => {
            const eventItems = scheduleEvents.filter((scheduleEvent) => getDateKey(scheduleEvent.date) === dayCell.dataset.eventDate);

            if (eventItems.length === 0) {
                return;
            }

            openEventPopup(eventItems, dayCell, eventItems[0].date);
        };

        calendarTable.addEventListener("click", (event) => {
            const dayCell = event.target instanceof Element ? event.target.closest(".schedule-calendar__day--has-events") : null;

            if (!dayCell) {
                return;
            }

            event.preventDefault();
            openDayCellEvents(dayCell);
        });

        calendarTable.addEventListener("keydown", (event) => {
            const dayCell = event.target instanceof Element ? event.target.closest(".schedule-calendar__day--has-events") : null;

            if (!dayCell || (event.key !== "Enter" && event.key !== " ")) {
                return;
            }

            event.preventDefault();
            openDayCellEvents(dayCell);
        });
    }

    popupCloseButton.addEventListener("click", closeEventPopup);

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            closeEventPopup();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !popup.hidden) {
            closeEventPopup();
        }
    });

    renderCalendar();
});

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
