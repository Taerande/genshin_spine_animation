// document.addEventListener("DOMContentLoaded", () => {
//   const $navigator = document.querySelector("nav");
//   const $mainItemList = document.querySelector(".wrapper");
//   let isTransitioning = false;

//   $navigator.addEventListener("click", (e) => {
//     if (isTransitioning) return;
//     const target = e.target.closest("li");
//     if (!target) return;

//     const current = $mainItemList.querySelector(".active");
//     if (!current) return;

//     const targetIndex = +target.dataset.itemIndex;
//     const currentIndex = +current.dataset.itemIndex;

//     if (targetIndex === currentIndex) return;

//     isTransitioning = true;

//     const direction = targetIndex > currentIndex ? "prev" : "next";
//     const newActive = $mainItemList.querySelector(
//       `[data-item-index="${targetIndex}"]`
//     );
//     if (!newActive) return;

//     newActive.classList.add("notransition");
//     newActive.style.transform =
//       direction === "prev" ? "translateY(30%)" : "translateY(-30%)";

//     // 강제 리플로우 발생
//     newActive.offsetHeight;
//     newActive.classList.remove("notransition");

//     newActive.classList.remove("prev", "next");
//     newActive.classList.add("active");

//     current.classList.remove("active");
//     current.classList.add(direction);

//     const handleTransitionEnd = (e) => {
//       if (e.propertyName !== "transform") return;
//       e.target.classList.remove("next", "prev");
//       e.target.style.transform = "";
//       isTransitioning = false;
//       e.target.removeEventListener("transitionend", handleTransitionEnd);
//     };

//     current.addEventListener("transitionend", handleTransitionEnd);
//     newActive.addEventListener("transitionend", handleTransitionEnd);
//   });

//   document.addEventListener('scroll', (e) => {

//   })
// });

document.addEventListener("DOMContentLoaded", () => {
  let isTransitioning = false;
  const $navigator = document.querySelector("nav");
  const $mainItemList = document.querySelector(".wrapper");
  const maxIndex = $mainItemList.children.length;

  const handleNavigation = (targetIndex) => {
    const current = $mainItemList.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;

    if (targetIndex === currentIndex) return;

    isTransitioning = true;

    const direction =
      (targetIndex > currentIndex &&
        !(currentIndex === 1 && targetIndex === maxIndex)) ||
      (currentIndex === maxIndex && targetIndex === 1)
        ? "prev"
        : "next";

    const newActive = $mainItemList.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    if (!newActive) return;

    newActive.classList.add("notransition");
    newActive.style.transform =
      direction === "prev" ? "translateY(30%)" : "translateY(-30%)";

    // 강제 리플로우 발생
    newActive.offsetHeight;
    newActive.classList.remove("notransition");

    newActive.classList.remove("prev", "next");
    newActive.classList.add("active");

    current.classList.remove("active");
    current.classList.add(direction);

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== "transform") return;
      e.target.classList.remove("next", "prev");
      e.target.style.transform = "";
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

    const targetIndex = +target.dataset.itemIndex;
    handleNavigation(targetIndex);
  });

  document.addEventListener("wheel", (e) => {
    if (isTransitioning) return;

    const current = $mainItemList.querySelector(".active");
    if (!current) return;

    const currentIndex = +current.dataset.itemIndex;
    let targetIndex;

    if (e.deltaY < 0) {
      targetIndex = ((currentIndex - 1 + maxIndex - 1) % maxIndex) + 1;
    } else {
      targetIndex = (currentIndex % maxIndex) + 1;
    }

    const newActive = $mainItemList.querySelector(
      `[data-item-index="${targetIndex}"]`
    );
    if (!newActive) return;

    handleNavigation(targetIndex);
  });
});
