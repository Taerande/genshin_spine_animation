import { t1, t2, t3, t4, t5, t6, t7, tInit } from "./gsap_transition.js";
import { isMobile } from "./isMobile.js";

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
  const swipeThreshold = 80;
  const $navigator = document.querySelector(".msg__navigator");
  const $drawer = document.querySelector(".msg__navigator--drawer");
  const $wrapper = document.querySelector("main.msg__wrapper");
  const $indicator = document.querySelector(".msg__indicator");
  const $sectionList = document.querySelectorAll(
    "main.msg__wrapper > section.msg__section"
  );
  const $hamburger = document.querySelector(".msg__hamburger");
  const $overlay = document.querySelector(".overlay");

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

  const resetPositionClass = (target) => {
    $sectionList.forEach((element) => {
      element.classList.remove("prev", "next");
    });
    target.classList.add("active");
    const targetIdx = [...$sectionList].indexOf(target);
    if (targetIdx - 1 >= 0) {
      $sectionList[targetIdx - 1].classList.add("prev");
    }
    if (targetIdx + 1 <= $sectionList.length - 1) {
      $sectionList[targetIdx + 1].classList.add("next");
    }
  };

  const getDirection = (NodeList, current, target) => {
    const currentIndex = [...NodeList].indexOf(current);
    const targetIndex = [...NodeList].indexOf(target);
    return targetIndex > currentIndex ? "next" : "prev";
  };

  const openDrawer = () => {
    $drawer.classList.add("active");
    $overlay.classList.add("active");
  };

  const closeDrawer = () => {
    $drawer.classList.remove("active");
    $overlay.classList.remove("active");
  };

  const getCurrentActiveIndex = (NodeList) => {
    return [...NodeList].findIndex((element) =>
      element.classList.contains("active")
    );
  };

  const moveIndicator = async (targetId, currentId) => {
    const $targetNav = $navigator
      .querySelector(`[href="#${targetId}"][data-msg-navigator]`)
      .closest("li");
    $drawer
      .querySelector(`[href="#${targetId}"][data-msg-navigator]`)
      .classList.add("active");

    $targetNav.classList.add("active");

    const { offsetHeight, offsetTop } = $targetNav;
    $indicator.style.transition = `transform ${
      pageTransitionDuration / 2
    }ms ease`;
    $indicator.style.transform = `translateY(${
      offsetTop - offsetHeight / 2 + "px"
    })`;

    closeDrawer();

    if (currentId) {
      $navigator
        .querySelector(`[href="#${currentId}"][data-msg-navigator]`)
        .closest("li")
        .classList.remove("active");
      $drawer
        .querySelector(`[href="#${currentId}"][data-msg-navigator]`)
        .classList.remove("active");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    let isSplashScreenOpening = true;
    let isTransitioning = false;
    let startY;
    const idSet = new Set();

    const style = getComputedStyle(document.documentElement);

    const essentialImages = [
      style.getPropertyValue("--bg_1").slice(5, -2),
      style.getPropertyValue("--bg_2").slice(5, -2),
      style.getPropertyValue("--bg_3").slice(5, -2),
      style.getPropertyValue("--bg_4").slice(5, -2),
      style.getPropertyValue("--bg_5").slice(5, -2),
      style.getPropertyValue("--bg_6").slice(5, -2),
      style.getPropertyValue("--bg_7").slice(5, -2),
    ];

    const init = async () => {
      $wrapper.querySelectorAll("section").forEach((element) => {
        idSet.add(element.id);
        if (isMobile) {
          element.classList.add("mobile");
        }
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
      resetPositionClass(current);

      moveIndicator(current.id, null);
      await tInit();
      timeLineMap[current.id].play();
      isSplashScreenOpening = false;
    };

    const handleNavigation = async (target) => {
      if (isTransitioning || isSplashScreenOpening) return;

      const current = [...$sectionList].find((element) =>
        element.classList.contains("active")
      );

      if (current === target || !current || !target) return;

      isTransitioning = true;
      const newUrl = `${window.location.pathname}#${target.id}`;
      history.pushState(null, "", newUrl);

      const direction = getDirection($sectionList, current, target);
      // 초기 클래스 설정
      target.classList.add(direction);

      // reflow
      target.offsetHeight;

      // transition
      target.classList.add("to-active");
      current.classList.add(direction === "next" ? "to-prev" : "to-next");
      current.classList.remove("active");
      moveIndicator(target.id, current.id);
      await waitForTransition(target);

      const container = current.querySelector(".container");
      if (container) {
        container.style.visibility = "hidden";
      }

      // 클래스 정리
      target.classList.remove("to-active");
      current.classList.remove("to-next", "to-prev");
      resetPositionClass(target);

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

    const handleNavigationBasedOnDelta = (delta) => {
      if (isTransitioning) return;

      const currentActiveIndex = getCurrentActiveIndex($sectionList);

      if (currentActiveIndex === -1) return;

      let targetIndex;

      if (delta > 0) {
        targetIndex = currentActiveIndex - 1;
      } else {
        targetIndex = currentActiveIndex + 1;
      }
      if (targetIndex < 0 || targetIndex > $sectionList.length) return;

      const target = $sectionList[targetIndex];
      if (!target) return;

      handleNavigation(target);
      $sectionList.forEach((element) => {
        element.style.transform = "";
      });
    };

    document.addEventListener("wheel", (e) =>
      handleNavigationBasedOnDelta(-e.deltaY)
    );

    document.addEventListener("touchstart", (e) => {
      if (e.target.tagName === "LI") return;
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
      }
    });

    document.addEventListener("touchmove", (e) => {
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      if (isTransitioning) return;
      const currentActiveIndex = getCurrentActiveIndex($sectionList);
      if (currentActiveIndex < 0) return;
      if (currentActiveIndex === $sectionList.length - 1 && diffY < 0) return;
      $sectionList[
        currentActiveIndex
      ].style.transform = `translateY(${diffY}px)`;

      if ($sectionList[currentActiveIndex - 1]) {
        $sectionList[
          currentActiveIndex - 1
        ].style.transform = `translateY(calc(-50% + ${diffY / 2}px))`;
      }
      if ($sectionList[currentActiveIndex + 1]) {
        $sectionList[
          currentActiveIndex + 1
        ].style.transform = `translateY(calc(50% + ${diffY / 2}px))`;
      }
    });

    document.addEventListener("touchend", async (e) => {
      if (startY === undefined) return;
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;
      if (deltaY === 0) return;
      if (Math.abs(deltaY) < swipeThreshold) {
        const currentActiveIndex = getCurrentActiveIndex($sectionList);
        if (currentActiveIndex < 0) return;
        if (currentActiveIndex === $sectionList.length - 1 && deltaY < 0)
          return;
        isTransitioning = true;
        $sectionList[currentActiveIndex].style.transition =
          "transform 0.5s ease";
        $sectionList[currentActiveIndex].style.transform = "translateY(0%)";

        waitForTransition($sectionList[currentActiveIndex]).then(() => {
          $sectionList[currentActiveIndex].style.transition = "";
          $sectionList[currentActiveIndex].style.transform = "";
          isTransitioning = false;
        });
        return;
      }
      if (isTransitioning) return;
      handleNavigationBasedOnDelta(deltaY);
      startY = undefined;
    });

    document.addEventListener("click", (e) => {
      if ($hamburger.contains(e.target)) {
        openDrawer();
      } else if (!$drawer.contains(e.target)) {
        closeDrawer();
      }
      navigatorClickHandler(e);

      if (document.querySelector(".content__tab").contains(e.target)) {
        document
          .querySelector(".content__tab")
          .querySelectorAll(".tab")
          .forEach((element) => {
            element.classList.remove("active");
          });
        const $targetLi = e.target.closest("li");
        $targetLi.classList.add("active");
        document
          .querySelectorAll("#main__item--02 .content > ul > li")
          .forEach((element) => {
            element.classList.remove("active");
          });

        document
          .querySelector(
            `.content [data-msg-tab="${$targetLi.dataset.msgTab}"]`
          )
          .classList.add("active");
      }
    });

    const progressIndicator = document.querySelector(
      ".msg__progress--indicator"
    );
    if (!window.msg) {
      window.msg = {};
    }
    const interval = setInterval(() => {
      progressIndicator.style.width = msg.preloadProgress + "%";
      if (msg.preloadProgress * 1 >= 100) {
        clearInterval(interval);
      }
    }, 16);
    const preloadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve();
        };
        img.importance = "high";
        img.fetchPriority = "high";
        img.loading = "eager";
        img.src = src;
      });

    Promise.all(essentialImages.map(preloadImage)).then(() => {
      init();
    });
  });
})();
