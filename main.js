const playSpine = () => {
  new spine.SpinePlayer("navia", {
    skeleton: "./data/navia.json",
    atlas: "./data/navia.atlas",
    animation: "animation",
    premultipliedAlpha: false,
    alpha: false,
    loop: true,
    autoplay: true,
    showControls: false,
    backgroundColor: "#ffffff",
  });
  new spine.SpinePlayer("nilu", {
    skeleton: "./data/nilu.json",
    atlas: "./data/nilu.atlas",
    animation: "aa",
    premultipliedAlpha: false,
    alpha: false,
    loop: true,
    autoplay: true,
    showControls: false,
    backgroundColor: "#ffffff",
  });
  new spine.SpinePlayer("emilly", {
    skeleton: "./data/emilly.json",
    atlas: "./data/emilly.atlas",
    animation: "animation",
    premultipliedAlpha: false,
    alpha: false,
    loop: true,
    autoplay: true,
    showControls: false,
    backgroundColor: "#ffffff",
  });
  new spine.SpinePlayer("yaran", {
    skeleton: "./data/yaran.json",
    atlas: "./data/yaran.atlas",
    animation: "animation",
    premultipliedAlpha: false,
    alpha: false,
    loop: true,
    autoplay: true,
    showControls: false,
    backgroundColor: "#ffffff",
  });
};
const delayTime = (time) => new Promise((resolve) => setTimeout(resolve, time));
document.addEventListener("DOMContentLoaded", () => {
  // playSpine();
  let isTransitioning = false;
  let startY;
  const globalTransitionDuration = 300;
  const swipeThreshold = 50;
  const $navigator = document.querySelector("nav");
  const $mainItemList = document.querySelector(".wrapper");
  const maxIndex = $mainItemList.children.length;

  const idSet = new Set();
  $mainItemList.querySelectorAll("section").forEach((element) => {
    idSet.add(element.id);
  });

  const defaultHash = window.location.hash.slice(1);
  let current;
  if (idSet.has(defaultHash)) {
    current = $mainItemList.querySelector(`#${defaultHash}`);
  } else {
    current = $mainItemList.querySelector("#main__item--01");
    // window.location.hash = "main__item--01";
  }

  const defaultId = current.dataset.itemIndex;
  current.classList.add("active");
  $navigator
    .querySelector(`[data-item-index="${defaultId}"]`)
    .classList.add("active");

  const handleNavigation = (targetIndex) => {
    if (isTransitioning) return;
    const current = $mainItemList.querySelector(".active");
    const currentLi = $navigator.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;
    if (targetIndex === currentIndex) return;

    isTransitioning = true;

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
      gsap.set(newActiveChildren, { clearProps: "all" });
    }
    if (currentChildren.length > 0) {
      gsap.set(currentChildren, { clearProps: "all" });
    }

    newActive.classList.add("notransition");
    newActive.style.transform =
      direction === "prev" ? "translateY(50%)" : "translateY(-50%)";

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

        if (index === 1) {
        } else if (index === 2) {
          const t2 = gsap.timeline();

          t2.to("#main__item--02 .title", {
            duration: 1,
            opacity: 1,
            backgroundSize: "100%",
            filter: "blur(0px)",
            ease: "power2.out",
          }).to(
            "#main__item--02 .subtitle",
            {
              duration: 1,
              opacity: 1,
              backgroundSize: "100%",
              y: "-50%",
              filter: "blur(0px)",
              ease: "power2.out",
            },
            "-=0.7"
          );
        } else if (index === 3) {
          const t3 = gsap.timeline();
          t3.to("#main__item--03 .title", {
            duration: 1.5,
            opacity: 1,
            backgroundSize: "100%",
            filter: "blur(0px) brightness(1.2)",
            ease: "power2.out",
          }).to(
            "#main__item--03 .subtitle",
            {
              duration: 0.7,
              opacity: 1,
              y: "-50%",
              filter: "blur(0px)",
              ease: "power2.out",
            },
            "-=1"
          );
        } else {
        }
      }

      await delayTime(globalTransitionDuration);
      isTransitioning = false;
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

    // window.location.hash = `main__item--0${target.dataset.itemIndex}`;
  });

  window.addEventListener("hashchange", (e) => {
    if (isTransitioning) return;
    const target = document.querySelector(window.location.hash);
    const current = $mainItemList.querySelector(".active");
    if (!current) return;

    const targetIndex = +target.dataset.itemIndex;
    handleNavigation(targetIndex);
  });

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
});
