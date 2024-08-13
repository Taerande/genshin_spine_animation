const style = getComputedStyle(document.documentElement);
window.msg = {};
msg.preloadProgress = 0;
const essentialImages = [
  style.getPropertyValue("--bg_1").slice(5, -2),
  style.getPropertyValue("--bg_2").slice(5, -2),
  style.getPropertyValue("--bg_3").slice(5, -2),
  style.getPropertyValue("--bg_4").slice(5, -2),
  style.getPropertyValue("--bg_5").slice(5, -2),
  style.getPropertyValue("--bg_6").slice(5, -2),
  style.getPropertyValue("--bg_7").slice(5, -2),
];

const preloadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      msg.preloadProgress += Math.ceil(100 / essentialImages.length);
      resolve();
    };
    img.importance = "high";
    img.fetchPriority = "high";
    img.loading = "eager";
    img.src = src;
  });

Promise.all(essentialImages.map(preloadImage));
