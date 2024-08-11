import { t1, t2, t3, t4, t5, t6, t7, tInit } from "./gsap_transition.js";
import { isMobile } from "./isMobile.js";
console.log(isMobile);
(() => {
  const delayTime = (time) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const timeLineMap = {
    "main__item--01": t1,
    "main__item--02": t2,
    "main__item--03": t3,
    "main__item--04": t4,
    "main__item--05": t5,
    "main__item--06": t6,
    "main__item--07": t7,
  };

  const globalTransitionDuration = 200;
  const pageTransitionDuration = 700;
  const pageTranslateMetric = "60%";
  const swipeThreshold = 50;
  const $navigator = document.querySelector(".msg__navigator");
  const $mobileNavigator = document.querySelector(".msg__navigator--mobile");
  const $wrapper = document.querySelector("main.msg__wrapper");
  const $indicator = document.querySelector(".msg__indicator");
  const $sectionList = document.querySelectorAll(
    "main.msg__wrapper > section.msg__section"
  );
  const $hamburger = document.querySelector(".msg__hamburger");
  const $overlay = document.querySelector(".overlay");

  const maxIndex = $sectionList.length;

  const waitForTransition = (element) => {
    return new Promise((resolve) => {
      const handleTransitionEnd = (e) => {
        if (e.propertyName !== "transform") return;
        element.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      };
      element.addEventListener("transitionend", handleTransitionEnd);
    });
  };

  const getDirection = (NodeList, current, target) => {
    const currentIndex = [...NodeList].indexOf(current);
    const targetIndex = [...NodeList].indexOf(target);
    return targetIndex > currentIndex ? "prev" : "next";
  };

  const getCurrentActiveIndex = (NodeList) => {
    return [...NodeList].findIndex((element) =>
      element.classList.contains("active")
    );
  };

  const moveIndicator = (activatedNode) => {
    const { offsetHeight, offsetTop } = activatedNode;
    $indicator.style.transition = `all ${pageTransitionDuration / 2}ms ease`;
    $indicator.style.top = offsetTop - offsetHeight / 2 + "px";
  };

  document.addEventListener("DOMContentLoaded", () => {
    let isSplashScreenOpening = true;
    let isTransitioning = false;
    let startY;
    const idSet = new Set();

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
      // TODO : 함수 추출하기로 가독성 향상 필요함
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

      moveIndicator(
        $navigator
          .querySelector(`[href="#${defaultId}"][data-msg-navigator]`)
          .closest("li")
      );

      tInit(timeLineMap[defaultId]).then(() => (isSplashScreenOpening = false));
    };

    const handleNavigation = async (target) => {
      // TODO : 함수 추출하기로 가독성 향상 필요함
      if (isTransitioning || isSplashScreenOpening) return;

      const current = [...$sectionList].find((element) =>
        element.classList.contains("active")
      );
      const currentLi = $navigator.querySelector(".active");
      const currentMobileAnchor = $mobileNavigator.querySelector(".active");

      if (current === target || !current || !target) return;

      isTransitioning = true;
      const newUrl = `${window.location.pathname}#${target.id}`;
      history.pushState(null, "", newUrl);

      const direction = getDirection($sectionList, current, target);

      const newActiveLi = $navigator
        .querySelector(`[href="#${target.id}"][data-msg-navigator]`)
        .closest("li");

      const newActiveMobileAnchor = $mobileNavigator.querySelector(
        `[href="#${target.id}"][data-msg-navigator]`
      );

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
      newActiveMobileAnchor.classList.add("active");
      currentLi.classList.remove("active");
      currentMobileAnchor.classList.remove("active");

      moveIndicator(newActiveLi);

      current.classList.remove("active");
      current.classList.add(direction);

      await waitForTransition(target);
      const container = current.querySelector(".container");
      if (container) {
        container.style.visibility = "hidden";
      }

      target.classList.remove("next", "prev");
      target.style.transform = "";

      timeLineMap[target.id].restart();
      await delayTime(globalTransitionDuration);
      isTransitioning = false;
    };

    const navigatorClickHandler = (e) => {
      if (e.target.tagName === "A" && idSet.has(e.target.href.split("#")[1])) {
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
    };

    $navigator.addEventListener("click", navigatorClickHandler);
    $mobileNavigator.addEventListener("click", navigatorClickHandler);

    document.addEventListener("wheel", (e) => {
      if (isTransitioning) return;

      const currentActiveIndex = getCurrentActiveIndex($sectionList);

      if (currentActiveIndex === -1) return;

      let targetIndex;

      // non_cyclic
      if (e.deltaY < 0) {
        targetIndex = currentActiveIndex - 1;
      } else {
        targetIndex = currentActiveIndex + 1;
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

      const currentActiveIndex = getCurrentActiveIndex($sectionList);

      if (currentActiveIndex === -1) return;

      let targetIndex;

      if (deltaY < 0) {
        targetIndex = currentActiveIndex + 1;
      } else {
        targetIndex = currentActiveIndex - 1;
      }

      if (targetIndex < 0 || targetIndex > maxIndex) return;

      const target = $sectionList[targetIndex];
      if (!target) return;

      handleNavigation(target);
    };

    // 모바일 터치 handleNavigation
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

    // 햄버거 이벤트
    window.addEventListener("click", (e) => {
      if ($hamburger.contains(e.target)) {
        $mobileNavigator.classList.add("active");
        $overlay.classList.add("active");
      } else {
        $mobileNavigator.classList.remove("active");
        $overlay.classList.remove("active");
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

  // import { t1, t2, t3, t4, t5, t6, t7, tInit } from "./gsap_transition.js";

  // // Constants
  // const DELAY_TIME = 200;
  // const PAGE_TRANSITION_DURATION = 700;
  // const PAGE_TRANSLATE_METRIC = "60%";
  // const SWIPE_THRESHOLD = 50;

  // const timeLineMap = {
  //   "main__item--01": t1,
  //   "main__item--02": t2,
  //   "main__item--03": t3,
  //   "main__item--04": t4,
  //   "main__item--05": t5,
  //   "main__item--06": t6,
  //   "main__item--07": t7,
  // };

  // // State
  // let isSplashScreenOpen = true;
  // let isInTransition = false;
  // let startY;

  // // DOM Elements
  // const navigator = document.querySelector(".msg__navigator");
  // const wrapper = document.querySelector("main.msg__wrapper");
  // const sectionList = document.querySelectorAll(
  //   "main.msg__wrapper > section.msg__section"
  // );
  // const maxIndex = sectionList.length;

  // // Helper functions
  // const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // const getEssentialImages = () => {
  //   const style = getComputedStyle(document.documentElement);
  //   return [1, 2, 3, 4, 5, 6, 7].map((i) =>
  //     style.getPropertyValue(`--bg_${i}`).slice(5, -2)
  //   );
  // };

  // const setupSections = () => {
  //   wrapper.querySelectorAll("section").forEach((element) => {
  //     element.style.transition = `transform ${PAGE_TRANSITION_DURATION}ms ease`;
  //   });
  // };

  // const setInitialActiveSection = () => {
  //   const defaultHash = window.location.hash.slice(1);
  //   const current = wrapper.querySelector(`#${defaultHash}`) || sectionList[0];
  //   current.classList.add("active");
  //   navigator
  //     .querySelector(`[href="#${current.id}"]`)
  //     .closest("li")
  //     .classList.add("active");
  //   tInit(timeLineMap[current.id]).then(() => (isSplashScreenOpen = false));
  // };

  // const preloadImages = () => {
  //   const essentialImages = getEssentialImages();
  //   let loadedCount = 0;
  //   essentialImages.forEach((src) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       loadedCount++;
  //       if (loadedCount === maxIndex) {
  //         init();
  //       }
  //     };
  //     img.onerror = (error) => console.error("Image load failed:", error);
  //     img.src = src;
  //     img.importance = "high";
  //     img.fetchPriority = "high";
  //     img.loading = "eager";
  //   });
  // };

  // const handleNavigatorClick = (e) => {
  //   if (e.target.tagName !== "A" || isInTransition) return;
  //   e.preventDefault();
  //   const targetId = e.target.href.split("#")[1];
  //   const targetElement = [...sectionList].find(
  //     (element) => element.id === targetId
  //   );
  //   if (targetElement) navigateTo(targetElement);
  // };

  // const handleWheel = (e) => {
  //   if (isInTransition) return;
  //   const currentIndex = getCurrentIndex();
  //   const targetIndex = e.deltaY < 0 ? currentIndex - 1 : currentIndex + 1;
  //   if (targetIndex >= 0 && targetIndex < maxIndex) {
  //     navigateTo(sectionList[targetIndex]);
  //   }
  // };

  // const handleTouchStart = (e) => {
  //   if (e.target.tagName === "LI") return;
  //   if (e.touches.length === 1) {
  //     startY = e.touches[0].clientY;
  //   }
  // };

  // const handleTouchEnd = (e) => {
  //   if (startY === null) return;
  //   const endY = e.changedTouches[0].clientY;
  //   const deltaY = endY - startY;
  //   if (Math.abs(deltaY) >= SWIPE_THRESHOLD) {
  //     const currentIndex = getCurrentIndex();
  //     const targetIndex = deltaY < 0 ? currentIndex + 1 : currentIndex - 1;
  //     if (targetIndex >= 0 && targetIndex < maxIndex) {
  //       navigateTo(sectionList[targetIndex]);
  //     }
  //   }
  //   startY = null;
  // };

  // const getCurrentIndex = () => {
  //   return [...sectionList].findIndex((element) =>
  //     element.classList.contains("active")
  //   );
  // };

  // const navigateTo = async (target) => {
  //   if (isInTransition || isSplashScreenOpen) return;
  //   const current = wrapper.querySelector(".active");
  //   if (current === target) return;

  //   isInTransition = true;
  //   const newUrl = `${window.location.pathname}#${target.id}`;
  //   history.pushState(null, "", newUrl);

  //   const direction = getDirection(current, target);
  //   updateNavigator(target);
  //   animateTransition(current, target, direction);

  //   await waitForTransition(target);
  //   finishTransition(current, target);
  // };

  // const getDirection = (current, target) => {
  //   const currentIndex = [...sectionList].indexOf(current);
  //   const targetIndex = [...sectionList].indexOf(target);
  //   return targetIndex > currentIndex ? "prev" : "next";
  // };

  // const updateNavigator = (target) => {
  //   navigator.querySelector(".active").classList.remove("active");
  //   navigator
  //     .querySelector(`[href="#${target.id}"]`)
  //     .closest("li")
  //     .classList.add("active");
  // };

  // const animateTransition = (current, target, direction) => {
  //   target.classList.add("notransition");
  //   target.style.transform =
  //     direction === "prev"
  //       ? `translateY(${PAGE_TRANSLATE_METRIC})`
  //       : `translateY(-${PAGE_TRANSLATE_METRIC})`;

  //   target.offsetHeight; // Force reflow
  //   target.classList.remove("notransition");
  //   target.classList.add("active");

  //   current.classList.remove("active");
  //   current.classList.add(direction);

  //   target.style.transform = "";
  // };

  // const waitForTransition = (element) => {
  //   return new Promise((resolve) => {
  //     const handleTransitionEnd = (e) => {
  //       if (e.propertyName !== "transform") return;
  //       element.removeEventListener("transitionend", handleTransitionEnd);
  //       resolve();
  //     };
  //     element.addEventListener("transitionend", handleTransitionEnd);
  //   });
  // };

  // const finishTransition = async (current, target) => {
  //   const container = current.querySelector(".container");
  //   if (container) container.style.visibility = "hidden";

  //   current.classList.remove("next", "prev");
  //   timeLineMap[target.id].restart();
  //   await delay(DELAY_TIME);
  //   isInTransition = false;
  // };

  // const setupEventListeners = () => {
  //   navigator.addEventListener("click", handleNavigatorClick);
  //   document.addEventListener("wheel", handleWheel);
  //   document.addEventListener("touchstart", handleTouchStart);
  //   document.addEventListener("touchend", handleTouchEnd);
  // };

  // const init = () => {
  //   setupSections();
  //   setInitialActiveSection();
  //   setupEventListeners();
  // };

  // document.addEventListener("DOMContentLoaded", () => {
  //   preloadImages();
  // });
})();
