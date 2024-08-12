export const tInit = (timeLine) =>
  new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          timeLine.play();
          resolve();
        },
      })
      .to(
        ".ms__logo",
        {
          scale: 1,
          opacity: 1,
          filter: "invert(1) blur(0px) grayscale(0%)",
          duration: 1,
          // duration: 0,
        },
        0
      )
      .to(
        ".pre-load",
        {
          opacity: 0,
          duration: 0.7,
          // duration: 0,
          scale: 1.2,
          filter: "brightness(4) blur(20px)",
          delay: 2,
          // delay: 0,
        },
        0
      );
  });

export const t1 = gsap
  .timeline({ paused: true })
  .from(
    "#main__item--01 .container",
    {
      duration: 0,
      visibility: "hidden",
    },
    0
  )
  .from(
    "#main__item--01 .subtitle",
    {
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    0
  );

export const t2 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--02 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from("#main__item--02 .title", {
    duration: 1,
    opacity: 0,
    scale: 1.2,
    filter: "blur(10px) brightness(10)",
    ease: "power4.ease",
  })
  .from(
    "#main__item--02 .subtitle",
    {
      duration: 1.5,
      opacity: 0,
      ease: "power4.ease",
    },
    "-=0.3"
  )
  .from(
    "#main__item--02 .content",
    {
      width: 0,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1.3"
  )
  .from(
    "#main__item--02 .content__tab",
    {
      width: 0,
      duration: 1,
      opacity: 0,
      filter: "brightness(4)",
      ease: "power4.ease",
    },
    "start+=1.3"
  )
  .from(
    "#main__item--02 .main__title",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2"
  )
  .from(
    "#main__item--02 .sub__list",
    {
      y: 30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2.2"
  );

export const t3 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--03 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from(
    "#main__item--03 .title",
    {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--03 .title",
    {
      filter: "blur(10px) brightness(4)",
      duration: 0.7,
      ease: "power4.easeIn",
    },
    "start+=0.3"
  )
  .from(
    "#main__item--03 .subtitle",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.3"
  )
  .from(
    "#main__item--03 .content",
    {
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.8"
  )
  .from(
    "#main__item--03 .content__item",
    {
      duration: 1.5,
      filter: "brightness(2)",
      ease: "power4.ease",
    },
    "start+=1"
  )
  .from(
    "#main__item--03 .content__item .item__title",
    {
      y: 30,
      duration: 1.2,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1"
  )
  .from(
    "#main__item--03 .content__item .item__caption",
    {
      y: -30,
      duration: 1.2,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1"
  );

export const t4 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--04 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from(
    "#main__item--04 .title",
    {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--04 .title",
    {
      filter: "blur(10px) brightness(4)",
      duration: 0.7,
      ease: "power4.easeIn",
    },
    "start+=0.3"
  )
  .from(
    "#main__item--04 .subtitle",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.3"
  )
  .from(
    "#main__item--04 .main__content",
    {
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1"
  )
  .from(
    "#main__item--04 .character",
    {
      scale: 0.9,
      x: 100,
      y: 40,
      duration: 1.3,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=.9"
  )
  .from(
    "#main__item--04 .cta",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1.1"
  );

export const t5 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--05 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from(
    "#main__item--05 .title",
    {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--05 .title",
    {
      filter: "blur(10px) brightness(4)",
      duration: 1.5,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--05 .subtitle",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.6"
  )
  .from(
    "#main__item--05 .container .item__bg",
    {
      duration: 0.7,
      height: 0,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1.3"
  )
  .from(
    "#main__item--05 .container .item__title",
    {
      y: -30,
      duration: 1.3,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2"
  )
  .from(
    "#main__item--05 .container .item__content",
    {
      y: -30,
      duration: 1.3,
      filter: "brightness(4) blur(20px)",
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2"
  )
  .from(
    "#main__item--05 .container .item__caption",
    {
      y: 30,
      duration: 1.3,
      filter: "brightness(4) blur(20px)",
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2"
  )
  .from(
    "#main__item--05 .container .cta",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2"
  );

export const t6 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--06 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from(
    "#main__item--06 .title",
    {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--06 .title",
    {
      filter: "blur(10px) brightness(4)",
      duration: 1.5,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--06 .subtitle",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.6"
  )
  .from(
    "#main__item--06 .content",
    {
      width: 0,
      duration: 0.7,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=1.3"
  )
  .from(
    "#main__item--06 .item__content",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      filter: "blur(10px) brightness(4)",
      ease: "power4.ease",
    },
    "start+=2"
  )
  .from(
    "#main__item--06 .item__caption",
    {
      y: 30,
      duration: 1,
      opacity: 0,
      filter: "blur(10px) brightness(4)",
      ease: "power4.ease",
    },
    "start+=2.2"
  )
  .from(
    "#main__item--06 .cta",
    {
      y: 50,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=2.2"
  );
export const t7 = gsap
  .timeline({ paused: true })
  .to(
    "#main__item--07 .container",
    {
      duration: 0,
      visibility: "visible",
    },
    0
  )
  .addLabel("start")
  .from(
    "#main__item--07 .title",
    {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--07 .title",
    {
      filter: "blur(10px) brightness(4)",
      duration: 1.5,
      ease: "power4.easeIn",
    },
    "start+=0"
  )
  .from(
    "#main__item--07 .subtitle",
    {
      y: -30,
      duration: 1,
      opacity: 0,
      ease: "power4.ease",
    },
    "start+=0.6"
  )
  .from(
    "#main__item--07 .content__item",
    {
      duration: 1,
      opacity: 0,
      ease: "power4.easeIn",
    },
    "start+=1"
  )
  .from(
    "#main__item--07 .content__item",
    {
      duration: 1,
      filter: "brightness(5) blur(0)",
      ease: "power4.easeIn",
    },
    "start+=1.3"
  )
  .from(
    "#main__item--07 .item__line",
    {
      duration: 1.2,
      width: 0,
      ease: "power4.easeIn",
    },
    "start+=2"
  )
  .from(
    "#main__item--07 .item__title",
    {
      duration: 1.2,
      y: -30,
      opacity: 0,
      ease: "power4.easeIn",
    },
    "start+=2.5"
  )
  .from(
    "#main__item--07 .item__caption",
    {
      duration: 1.2,
      y: 30,
      opacity: 0,
      ease: "power4.easeIn",
    },
    "start+=2.5"
  );
