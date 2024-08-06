import { t1, t2, t3, t4, t5, t6, t7, tInit } from "./gsap_transition.js";

const delayTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

const timeLineMap = {
  "main__item--01": t1,
  "main__item--02": t2,
  "main__item--03": t3,
  "main__item--04": t4,
  "main__item--05": t5,
  "main__item--06": t6,
  "main__item--07": t7,
};

document.addEventListener("DOMContentLoaded", () => {
  let isSplashScreenOpening = true;
  let isTransitioning = false;
  let startY;
  const globalTransitionDuration = 200;
  const pageTransitionDuration = 700;
  const pageTranslateMetric = "60%";
  const swipeThreshold = 50;
  const $navigator = document.querySelector(".msg__navigator");
  const $wrapper = document.querySelector("main.msg__wrapper");
  const $sectionList = document.querySelectorAll(
    "main.msg__wrapper > section.msg__section"
  );

  const maxIndex = $sectionList.length;

  const style = getComputedStyle(document.documentElement);
  let preloadImageCount = 0;
  const essentialImages = [
    style.getPropertyValue("--bg_1").slice(5, -2),
    style.getPropertyValue("--bg_2").slice(5, -2),
    style.getPropertyValue("--bg_3").slice(5, -2),
    style.getPropertyValue("--bg_4").slice(5, -2),
    style.getPropertyValue("--bg_5").slice(5, -2),
    style.getPropertyValue("--bg_6").slice(5, -2),
    style.getPropertyValue("--bg_7").slice(5, -2),
  ];

  const init = () => {
    const idSet = new Set();
    $wrapper.querySelectorAll("section").forEach((element) => {
      idSet.add(element.id);
      element.style.transition = `transform ${pageTransitionDuration}ms ease`;
    });
    const defaultHash = window.location.hash.slice(1);
    let current;
    if (idSet.has(defaultHash)) {
      current = $wrapper.querySelector(`#${defaultHash}`);
    } else {
      const firstId = [...idSet][0];
      current = $wrapper.querySelector(`#${firstId}`);
      history.replaceState(null, null, `#${firstId}`);
    }
    const defaultId = current.id;

    current.classList.add("active");
    $navigator
      .querySelector(`[href="#${defaultId}"]`)
      .closest("li")
      .classList.add("active");

    tInit(timeLineMap[defaultId]).then(() => (isSplashScreenOpening = false));
  };

  const handleNavigation = (target) => {
    if (isTransitioning || isSplashScreenOpening) return;

    const current = $wrapper.querySelector(".active");
    const currentLi = $navigator.querySelector(".active");

    if (current === target) return;

    const currentIndex = [...$sectionList].indexOf(current);
    const targetIndex = [...$sectionList].indexOf(target);
    if (targetIndex === -1) return;

    isTransitioning = true;
    const newUrl = `${window.location.pathname}#${target.id}`;
    history.pushState(null, "", newUrl);

    const direction = targetIndex > currentIndex ? "prev" : "next";

    const newActiveLi = $navigator
      .querySelector(`[href="#${target.id}"]`)
      .closest("li");

    target.classList.add("notransition");
    target.style.transform =
      direction === "prev"
        ? `translateY(${pageTranslateMetric})`
        : `translateY(-${pageTranslateMetric})`;

    // 강제 리플로우 발생
    target.offsetHeight;
    target.classList.remove("notransition");
    target.classList.remove("prev", "next");
    target.classList.add("active");

    newActiveLi.classList.add("active");
    currentLi.classList.remove("active");

    current.classList.remove("active");
    current.classList.add(direction);

    const handleTransitionEnd = async (e) => {
      if (e.propertyName !== "transform") return;

      const container = current.querySelector(".container");
      if (container) {
        container.style.visibility = "hidden";
      }

      e.target.classList.remove("next", "prev");
      e.target.style.transform = "";

      const transitionElement = e.target.classList.contains("active");
      if (transitionElement) {
        timeLineMap[target.id].restart();
        await delayTime(globalTransitionDuration);
        isTransitioning = false;
      }

      e.target.removeEventListener("transitionend", handleTransitionEnd);
    };

    current.addEventListener("transitionend", handleTransitionEnd);
    target.addEventListener("transitionend", handleTransitionEnd);
  };

  $navigator.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
    }
    if (isTransitioning) return;
    const target = e.target.closest("a");
    if (!target) return;

    const targetId = target.href.split("#")[1];

    const targetElement = [...$sectionList].find(
      (element) => element.id === targetId
    );

    handleNavigation(targetElement);
  });

  document.addEventListener("wheel", (e) => {
    if (isTransitioning) return;

    const current = [...$sectionList].find((element) =>
      element.classList.contains("active")
    );

    const currentIndex = [...$sectionList].indexOf(current);

    if (!current) return;

    let targetIndex;

    // non_cyclic
    if (e.deltaY < 0) {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }
    if (targetIndex < 0 || targetIndex > maxIndex) return;

    const target = $sectionList[targetIndex];
    if (!target) return;

    handleNavigation(target);
  });

  const handleSwipe = (startY, endY) => {
    if (isTransitioning) return;
    const deltaY = endY - startY;
    if (Math.abs(deltaY) < swipeThreshold) return;

    const current = [...$sectionList].find((element) =>
      element.classList.contains("active")
    );

    const currentIndex = [...$sectionList].indexOf(current);

    if (!current) return;

    let targetIndex;

    if (deltaY < 0) {
      targetIndex = currentIndex + 1;
    } else {
      targetIndex = currentIndex - 1;
    }

    if (targetIndex < 0 || targetIndex > maxIndex) return;

    const target = $sectionList[targetIndex];
    if (!target) return;

    handleNavigation(target);
  };

  document.addEventListener("touchstart", (e) => {
    if (e.target.tagName === "LI") return;
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
    }
  });

  document.addEventListener("touchend", (e) => {
    if (startY !== undefined) {
      const endY = e.changedTouches[0].clientY;
      handleSwipe(startY, endY);
      startY = undefined; // Reset startX
    }
  });

  essentialImages.forEach((element) => {
    const img = new Image();
    img.onload = () => {
      preloadImageCount += 1;
      if (maxIndex === preloadImageCount) {
        init();
      }
    };
    img.importance = "high";
    img.fetchPriority = "high";
    img.loading = "eager";
    img.src = element;
  });
});
