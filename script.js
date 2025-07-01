function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();

// ✅ Canvas Setup
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// ✅ Total frames
const frameCount = 300;
const images = [];
const imageSeq = { frame: 0 };

// ✅ File name generator (root folder)
function getFrameFile(index) {
  const num = String(index + 1).padStart(4, "0");
  return `./male${num}.png`;
}

// ✅ Lazy-load each image
function loadImage(index) {
  if (images[index]) return images[index];
  const img = new Image();
  img.src = getFrameFile(index);
  images[index] = img;
  return img;
}

// ✅ Render frame
function render() {
  const img = loadImage(imageSeq.frame);
  if (!img.complete) return;

  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const cx = (canvas.width - img.width * ratio) / 2;
  const cy = (canvas.height - img.height * ratio) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    img,
    0, 0, img.width, img.height,
    cx, cy,
    img.width * ratio, img.height * ratio
  );
}

// ✅ Animate on scroll
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.2,
    trigger: "#page>canvas",
    start: "top top",
    end: "600% top",
    scroller: "#main",
  },
  onUpdate: render,
});

// ✅ Initial render
loadImage(0).onload = render;

// ✅ Pin page sections
["#page1", "#page2", "#page3"].forEach((id) => {
  gsap.to(id, {
    scrollTrigger: {
      trigger: id,
      start: "top top",
      end: "bottom top",
      pin: true,
      scroller: "#main",
    },
  });
});