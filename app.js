(() => {
  const installStatus = document.querySelector("[data-install-status]");
  const installButton = document.querySelector("[data-install-button]");
  const header = document.querySelector("[data-site-header]");
  const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  const modalLayer = document.querySelector("[data-modal-layer]");
  const modalPanel = document.querySelector("[data-modal-panel]");
  const modalViews = [...document.querySelectorAll("[data-modal-view]")];
  const calendarGrid = document.querySelector("[data-calendar-grid]");
  const calendarTitle = document.querySelector("[data-calendar-title]");
  const calendarPrev = document.querySelector("[data-calendar-prev]");
  const calendarNext = document.querySelector("[data-calendar-next]");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let installPromptEvent;

  const holidayMap = {
    "2026-01-01": "신정",
    "2026-02-16": "설날 연휴",
    "2026-02-17": "설날",
    "2026-02-18": "설날 연휴",
    "2026-03-01": "삼일절",
    "2026-03-02": "삼일절 대체공휴일",
    "2026-05-05": "어린이날",
    "2026-05-24": "부처님오신날",
    "2026-05-25": "부처님오신날 대체공휴일",
    "2026-06-06": "현충일",
    "2026-08-15": "광복절",
    "2026-08-17": "광복절 대체공휴일",
    "2026-09-24": "추석 연휴",
    "2026-09-25": "추석",
    "2026-09-26": "추석 연휴",
    "2026-10-03": "개천절",
    "2026-10-05": "개천절 대체공휴일",
    "2026-10-09": "한글날",
    "2026-12-25": "성탄절",
  };

  let calendarDate = new Date();

  const toDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const syncHeaderState = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
  };

  const syncActiveNav = () => {
    const current = [...sections]
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 120);

    if (!current) {
      return;
    }

    for (const link of navLinks) {
      const isCurrent = link.getAttribute("href") === `#${current.id}`;
      link.toggleAttribute("aria-current", isCurrent);
    }
  };

  const syncUiState = () => {
    syncHeaderState();
    syncActiveNav();
  };

  const renderClinicCalendar = () => {
    if (!calendarGrid || !calendarTitle) {
      return;
    }

    const now = new Date();
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const todayKey = toDateKey(now);
    const monthLabel = `${year}년 ${month + 1}월`;

    calendarTitle.textContent = `${monthLabel} 진료 달력`;
    calendarGrid.innerHTML = "";

    for (const dayName of ["일", "월", "화", "수", "목", "금", "토"]) {
      const heading = document.createElement("div");
      heading.className = "calendar-weekday";
      heading.textContent = dayName;
      calendarGrid.append(heading);
    }

    for (let i = 0; i < firstDay.getDay(); i += 1) {
      const spacer = document.createElement("span");
      spacer.className = "calendar-day is-empty";
      calendarGrid.append(spacer);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = new Date(year, month, day);
      const dateKey = toDateKey(date);
      const holidayName = holidayMap[dateKey];
      const isSunday = date.getDay() === 0;
      const isClosed = isSunday || Boolean(holidayName);
      const dayButton = document.createElement("button");

      dayButton.type = "button";
      dayButton.className = [
        "calendar-day",
        isClosed ? "is-closed" : "",
        dateKey === todayKey ? "is-today" : "",
      ]
        .filter(Boolean)
        .join(" ");
      dayButton.innerHTML = `<strong>${day}</strong><span>${
        holidayName || (isSunday ? "일요일" : "확인")
      }</span>`;
      dayButton.setAttribute(
        "aria-label",
        `${monthLabel} ${day}일 ${holidayName || (isSunday ? "일요일 휴무" : "진료 여부 전화 확인")}`,
      );
      dayButton.addEventListener("click", () => {
        openModal("calendar");
      });
      calendarGrid.append(dayButton);
    }
  };

  const openModal = (viewName) => {
    if (!modalLayer || !modalPanel) {
      return;
    }

    for (const view of modalViews) {
      view.hidden = view.dataset.modalView !== viewName;
    }

    if (viewName === "calendar") {
      renderClinicCalendar();
    }

    modalLayer.hidden = false;
    document.body.classList.add("has-open-modal");
    modalPanel.focus();
  };

  const closeModal = () => {
    if (!modalLayer) {
      return;
    }

    modalLayer.hidden = true;
    document.body.classList.remove("has-open-modal");
  };

  syncUiState();
  renderClinicCalendar();
  window.addEventListener("scroll", syncUiState, { passive: true });

  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.modalOpen);
    });
  });

  calendarPrev?.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    renderClinicCalendar();
  });

  calendarNext?.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    renderClinicCalendar();
  });

  modalLayer?.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-close], .modal-backdrop")) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // The site still works normally if service worker registration is blocked.
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPromptEvent = event;
    if (installButton) {
      installButton.hidden = false;
    }
    if (installStatus) {
      installStatus.textContent =
        "Android Chrome에서 아래 버튼을 누르면 앱 설치 팝업이 열립니다.";
    }
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    if (installButton) {
      installButton.hidden = true;
    }
    if (installStatus) {
      installStatus.textContent = "설치가 완료되었습니다. 홈 화면에서 서울정형외과를 열 수 있습니다.";
    }
  });

  installButton?.addEventListener("click", async () => {
    if (!installPromptEvent) {
      if (installStatus) {
        installStatus.textContent =
          "현재 브라우저에서는 자동 설치 팝업을 열 수 없습니다. Android Chrome에서 접속하거나 아래 안내에 따라 홈 화면에 추가해 주세요.";
      }
      return;
    }

    installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    installPromptEvent = null;
    if (choice.outcome === "accepted" && installButton) {
      installButton.hidden = true;
    }
    if (installStatus) {
      installStatus.textContent =
        choice.outcome === "accepted"
          ? "설치가 시작되었습니다. 홈 화면에서 서울정형외과 아이콘을 확인해 주세요."
          : "설치가 취소되었습니다. 필요하실 때 다시 설치 버튼을 눌러 주세요.";
    }
  });
})();
