(() => {
  const installStatus = document.querySelector("[data-install-status]");
  const installButton = document.querySelector("[data-install-button]");
  let installPromptEvent;

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
