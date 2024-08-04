import { t1, t2, t3, t4, t5, t6, t7, tInit } from "./gsap_transition.js";

const delayTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

document.addEventListener("DOMContentLoaded", () => {
  let isTransitioning = false;
  let startY;
  const globalTransitionDuration = 200;
  const pageTransitionDuration = 700;
  const pageTranslateMetric = "60%";
  const swipeThreshold = 50;
  const $navigator = document.querySelector("nav");
  const $mainItemList = document.querySelector(".wrapper");
  const maxIndex = $mainItemList.children.length;

  const init = () => {
    const idSet = new Set();
    $mainItemList.querySelectorAll("section").forEach((element) => {
      idSet.add(element.id);
      element.style.transition = `transform ${pageTransitionDuration}ms ease`;
    });

    const defaultHash = window.location.hash.slice(1);
    let current;
    if (idSet.has(defaultHash)) {
      current = $mainItemList.querySelector(`#${defaultHash}`);
    } else {
      current = $mainItemList.querySelector("#main__item--01");
      history.replaceState(null, null, "#main__item--01");
    }

    const defaultId = current.dataset.itemIndex;
    current.classList.add("active");
    $navigator
      .querySelector(`[data-item-index="${defaultId}"]`)
      .classList.add("active");

    switch (+current.dataset.itemIndex) {
      case 1:
        tInit(t1);
        break;
      case 2:
        tInit(t2);
        break;
      case 3:
        tInit(t3);
        break;
      case 4:
        tInit(t4);
        break;
      case 5:
        tInit(t5);
        break;
      case 6:
        tInit(t6);
        break;
      case 7:
        tInit(t7);
        break;
    }
  };

  const handleNavigation = (targetIndex) => {
    if (isTransitioning) return;
    const current = $mainItemList.querySelector(".active");
    const currentLi = $navigator.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;
    if (targetIndex === currentIndex) return;

    isTransitioning = true;
    const newUrl = `${window.location.pathname}#main__item--0${targetIndex}`;
    history.pushState(null, "", newUrl);

    const direction = targetIndex > currentIndex ? "prev" : "next";

    const newActiveLi = $navigator.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    const newActive = $mainItemList.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    if (!newActive) return;

    const newActiveChildren = newActive.querySelectorAll("*");
    const currentChildren = current.querySelectorAll("*");

    // reset style
    if (newActiveChildren.length > 0) {
      const container = newActive.querySelector(".container");
      setTimeout(() => {
        container.style.visibility = "hidden";
      }, pageTransitionDuration);
    }
    if (currentChildren.length > 0) {
      const container = current.querySelector(".container");
      setTimeout(() => {
        container.style.visibility = "hidden";
      }, pageTransitionDuration);
    }

    newActive.classList.add("notransition");
    newActive.style.transform =
      direction === "prev"
        ? `translateY(${pageTranslateMetric})`
        : `translateY(-${pageTranslateMetric})`;

    // 강제 리플로우 발생
    newActive.offsetHeight;
    newActive.classList.remove("notransition");

    newActive.classList.remove("prev", "next");
    newActive.classList.add("active");
    newActiveLi.classList.add("active");
    currentLi.classList.remove("active");

    current.classList.remove("active");
    current.classList.add(direction);

    const handleTransitionEnd = async (e) => {
      if (e.propertyName !== "transform") return;

      e.target.classList.remove("next", "prev");
      e.target.style.transform = "";

      const transitionElement = e.target.classList.contains("active");
      if (transitionElement) {
        const index = +e.target.dataset.itemIndex;
        switch (+index) {
          case 1:
            t1.restart();
            break;
          case 2:
            t2.restart();
            break;
          case 3:
            t3.restart();
            break;
          case 4:
            t4.restart();
            break;
          case 5:
            t5.restart();
            break;
          case 6:
            t6.restart();
            break;
          case 7:
            t7.restart();
            break;
        }
        await delayTime(globalTransitionDuration);
        isTransitioning = false;
      }

      e.target.removeEventListener("transitionend", handleTransitionEnd);
    };

    current.addEventListener("transitionend", handleTransitionEnd);
    newActive.addEventListener("transitionend", handleTransitionEnd);
  };

  $navigator.addEventListener("click", (e) => {
    if (isTransitioning) return;
    const target = e.target.closest("li");
    if (!target) return;

    handleNavigation(target.dataset.itemIndex);
  });

  // window.addEventListener("hashchange", (e) => {
  //   if (isTransitioning) return;
  //   const target = document.querySelector(window.location.hash);
  //   const current = $mainItemList.querySelector(".active");
  //   if (!current) return;

  //   const targetIndex = +target.dataset.itemIndex;
  //   handleNavigation(targetIndex);
  // });

  document.addEventListener("wheel", (e) => {
    if (isTransitioning) return;

    const current = $mainItemList.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;
    let targetIndex;

    // non_cyclic
    if (e.deltaY < 0) {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }
    if (targetIndex < 0 || targetIndex > maxIndex) return;

    const newActive = $mainItemList.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    if (!newActive) return;

    handleNavigation(targetIndex);

    // window.location.hash = `main__item--0${targetIndex}`;
  });

  const handleSwipe = (startY, endY) => {
    if (isTransitioning) return;
    const deltaY = endY - startY;
    if (Math.abs(deltaY) < swipeThreshold) return;
    const current = $mainItemList.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;
    let targetIndex;

    if (deltaY < 0) {
      targetIndex = currentIndex + 1;
    } else {
      targetIndex = currentIndex - 1;
    }

    if (targetIndex < 0 || targetIndex > maxIndex) return;

    const newActive = $mainItemList.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    if (!newActive) return;

    // window.location.hash = `main__item--0${targetIndex}`;
    handleNavigation(targetIndex);
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

  init();
});
