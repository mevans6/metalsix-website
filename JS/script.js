document.addEventListener("DOMContentLoaded", () => {
  setupNewsletter();
  setupAudioPlayers();
});

function setupNewsletter() {
  const popup = document.getElementById("email-popup");
  const closeButton = popup?.querySelector(".popup-close");
  const form = document.getElementById("email-form");
  const openButtons = document.querySelectorAll("[data-open-newsletter]");

  if (!popup || !closeButton || !form) {
    return;
  }

  const storageKey = "metalsix-newsletter-dismissed";
  let previousFocus = null;

  const rememberDismissal = () => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // The popup still works when storage is disabled.
    }
  };

  const wasDismissed = () => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  };

  const openPopup = () => {
    previousFocus = document.activeElement;
    popup.classList.add("is-visible");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
    closeButton.focus();
  };

  const closePopup = ({ remember = true } = {}) => {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");

    if (remember) {
      rememberDismissal();
    }

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", openPopup);
  });

  closeButton.addEventListener("click", () => closePopup());

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-visible")) {
      closePopup();
    }
  });

  form.addEventListener("submit", () => {
    if (form.checkValidity()) {
      rememberDismissal();
      window.setTimeout(() => closePopup({ remember: false }), 150);
    }
  });

  if (!wasDismissed()) {
    window.setTimeout(openPopup, 4000);
  }
}

function setupAudioPlayers() {
  const audioElements = Array.from(document.querySelectorAll("audio[id^='audio-']"));
  const status = document.getElementById("audio-status");
  let currentAudio = null;

  const formatTime = (totalSeconds) => {
    if (!Number.isFinite(totalSeconds)) {
      return "0:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const elementsFor = (audio) => {
    const trackKey = audio.id.replace("audio-", "");
    return {
      button: document.querySelector(`[data-audio-id="${audio.id}"]`),
      currentTime: document.getElementById(`current-time-${trackKey}`),
      duration: document.getElementById(`duration-${trackKey}`),
      progress: document.getElementById(`progress-bar-${trackKey}`),
    };
  };

  const setButtonState = (audio, isPlaying) => {
    const { button } = elementsFor(audio);
    if (!button) {
      return;
    }

    const icon = button.querySelector("i");
    const trackName = audio.closest(".track")?.querySelector("h3")?.textContent || "track";
    icon?.classList.toggle("fa-play", !isPlaying);
    icon?.classList.toggle("fa-pause", isPlaying);
    button.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${trackName}`);
  };

  const updateProgress = (audio) => {
    const { currentTime, duration, progress } = elementsFor(audio);
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

    if (currentTime) {
      currentTime.textContent = formatTime(audio.currentTime);
    }
    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }
    if (progress) {
      progress.style.width = `${percent}%`;
    }
  };

  audioElements.forEach((audio) => {
    const { button } = elementsFor(audio);
    const seekButton = document.querySelector(`[data-seek-for="${audio.id}"]`);

    audio.addEventListener("loadedmetadata", () => updateProgress(audio));
    audio.addEventListener("timeupdate", () => updateProgress(audio));
    audio.addEventListener("pause", () => setButtonState(audio, false));
    audio.addEventListener("play", () => setButtonState(audio, true));
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      currentAudio = null;
      setButtonState(audio, false);
      updateProgress(audio);
    });
    audio.addEventListener("error", () => {
      if (status) {
        status.textContent = "This track could not be loaded. Please refresh and try again.";
      }
      setButtonState(audio, false);
    });

    button?.addEventListener("click", async () => {
      if (status) {
        status.textContent = "";
      }

      if (!audio.paused) {
        audio.pause();
        currentAudio = null;
        return;
      }

      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
      }

      try {
        await audio.play();
        currentAudio = audio;
      } catch {
        if (status) {
          status.textContent = "Playback was blocked. Select play again to start the track.";
        }
        setButtonState(audio, false);
      }
    });

    seekButton?.addEventListener("click", (event) => {
      if (!audio.duration) {
        return;
      }

      const bounds = seekButton.getBoundingClientRect();
      const ratio = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
      audio.currentTime = ratio * audio.duration;
      updateProgress(audio);
    });

    if (audio.readyState >= 1) {
      updateProgress(audio);
    }
  });
}
