(() => {
  const installStatus = document.querySelector("[data-install-status]");
  let installPromptEvent;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // The site still works normally if service worker registration is blocked.
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    installPromptEvent = event;
    if (installStatus) {
      installStatus.textContent = "Android Chrome에서 설치 버튼이 보이면 바로 앱처럼 설치할 수 있습니다.";
    }
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    if (installStatus) {
      installStatus.textContent = "설치가 완료되었습니다. 홈 화면에서 서울정형외과를 열 수 있습니다.";
    }
  });

  document.querySelector("[data-install-button]")?.addEventListener("click", async () => {
    if (!installPromptEvent) {
      document.querySelector("#app")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    installPromptEvent = null;
  });
})();
