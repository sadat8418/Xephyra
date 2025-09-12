import Lenis from 'lenis'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { SplitText } from "gsap/all";

document.addEventListener("DOMContentLoaded",()=>{

const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger, SplitText);
//   duration: 1.2,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   smooth: true,
// });



const nav = document.querySelector("nav");
const header = document.querySelector(".header3");
const heroImg = document.querySelector(".hero-img");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const setCanvasSize = () => {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  context.scale(pixelRatio, pixelRatio);
};
setCanvasSize();

const frameCount = 412; //416. 412
const currentFrame = (index) =>
  `assets/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

let images2 = [];
let videoFrames = { frame: 0 };
let imagesToLoad = frameCount;

const onLoad = () => {
  imagesToLoad--;

  if (!imagesToLoad) {
    render();
    setupScrollTrigger();
  }
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.onload = onLoad;
  img.onerror = function () {
    onLoad.call(this);
  };
  img.src = currentFrame(i);
  images2.push(img);
}
const render = () =>{
  const canvasWidth =window.innerWidth;
  const canvasHeight =window.innerHeight;
  context.clearRect(0,0, canvasWidth, canvasHeight );

const img = images2[videoFrames.frame];
if (img && img.complete && img.naturalWidth > 0) {
  const imageAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (imageAspect > canvasAspect) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imageAspect;
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imageAspect;
    drawX = 0;
    drawY = (canvasHeight - drawHeight) / 2;
  }
  context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}
};   
const setupScrollTrigger = () => {
  // ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  ScrollTrigger.create({
    trigger: ".hero3",
    start: "top top",
    end: `+=${window.innerHeight * 7}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const animationProgress = Math.min(progress / 0.9, 1);
      const targetFrame = Math.round(animationProgress * (frameCount - 1));
      videoFrames.frame = targetFrame;
      render();

      // Animate nav
      if (progress <= 0.1) {
        const navProgress = progress / 0.1;
        const opacity = 1 - navProgress;
        gsap.set(nav, { opacity });
      } else {
        gsap.set(nav, { opacity: 0 });
      }

      // Animate header
      if (progress <= 0.25) {
        const zProgress = progress / 0.25;
        const translateZ = zProgress * -500;

        let opacity = 1;
        if (progress >= 0.2) {
          const fadeProgress = Math.min((progress - 0.2) / 0.2, 1);
          opacity = 1 - fadeProgress;
        }

        gsap.set(header, {
          transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
          opacity,
        });
      } else {
        gsap.set(header, { opacity: 0 });
      }

      // Animate heroImg
      if (progress < 0.6) {
        gsap.set(heroImg, {
          transform: "translateZ(1000px)",
          opacity: 0,
        });
      } else if (progress >= 0.6 && progress <= 0.9) {
        const imgProgress = (progress - 0.6) / 0.3;
        const translateZ = 1000 - imgProgress * 1000;
 let opacity = 0;
        if (progress <= 0.8) {
          const opacityProgress = (progress - 0.6) / 0.2;
          opacity = opacityProgress;
        } else {
          opacity = 1;
        }

        gsap.set(heroImg, {
          transform: `translateZ(${translateZ}px)`,
          opacity,
        });
      } else {
        gsap.set(heroImg, {
          transform: "translateZ(0px)",
          opacity: 1,
        });
      }
    }
  });
  ScrollTrigger.create({
  trigger: ".banner",
  start: "top top",
  end: `+=${window.innerHeight * 5}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    gsap.set(bannerContainer, { scale: progress });

   bannerMaskLayers.forEach((layer, i) => {  
  const initialScale = 0.9 - i * 0.15;
  const layerProgress = Math.min(progress / 0.9, 1.0);
  const currentScale = 
    initialScale + layerProgress * (1.0 - initialScale);

  gsap.set(layer, { scale: currentScale });
});
if (progress <= 0.9) {
  const textProgress = progress / 0.9;
  const moveDistance = window.innerWidth * 0.5;

  gsap.set(bannerIntroTextElements[0], {
    x: -textProgress * moveDistance,
  });

  gsap.set(bannerIntroTextElements[1], {
    x: textProgress * moveDistance,
  });
}

if (progress >= 0.7 && progress <= 0.9) {
  const headerProgress = (progress - 0.7) / 0.2;
  const totalWords = words.length;

  words.forEach((word, i) => {
    const wordStartDelay = i / totalWords;
    const wordEndDelay = (i + 1) / totalWords;

    let wordOpacity = 0;
if (headerProgress >= wordEndDelay) {
  wordOpacity = 1;
} else if (headerProgress >= wordStartDelay) {
  const wordProgress =
    (headerProgress - wordStartDelay) /
    (wordEndDelay - wordStartDelay);
  wordOpacity = wordProgress;
}

gsap.set(word, { opacity: wordOpacity });


  });
}else if (progress < 0.7) {
gsap.set(words, { opacity: 0 });
}else if (progress > 0.9) {
    gsap.set(words, { opacity: 1 });
    }
    },
});
};



window.addEventListener("resize", () => {
  setCanvasSize();
  render();
  ScrollTrigger.refresh();
});


 

// part1
const container = document.querySelector('.trail-container');

const config = {
    imageCount: 35,
    imageLifespan: 600, //750
    removlalDelay: 50,
    mouseThreshold: 100,
    scrollThreshold: 50,
    idleCursorInterval: 300,
    inDuration: 750,
    outDuration: 1000,
    inEasing:"cubic-bezier(0.7, 0.5, 0.5, 1)",
    outEasing:"cubic-bezier(0.87, 0, 0.13, 1)",
    // generateOnIdle: false,
};
// ,  ==> .map
const images = Array.from(
    {length:config.imageCount},
    (_, index)=>
`assets/img${index + 1}.jpeg`);
const trail =[];

 let mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0;
    let isMoving = false,
        isCursorInContainer = 0,
        lastRemovalTime = 0,
        lastSteadyImageTime = 0,
        lastScrollTime = 0;
    let isScrolling = false,
        scrollTicking = false;

    const isInContainer = (x, y) => {
        const rect = container.getBoundingClientRect();
        return (
            x >= rect.left && x <= rect.right &&
            y >= rect.top && y <= rect.bottom
        );
    };


      const setInitialMousePos = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        isCursorInContainer = isInContainer(mouseX, mouseY);

        document.removeEventListener("mouseover", setInitialMousePos, false);
    };

    document.addEventListener("mouseover", setInitialMousePos, false);

    const hasMovedEnough = () => {
        const distance = Math.sqrt(
            Math.pow(mouseX - lastMouseX, 2) +
            Math.pow(mouseY - lastMouseY, 2)
        );
        return distance > config.mouseThreshold;
    };
    const createTrailImage = () => {
  if (!isCursorInContainer) return;

  const now = Date.now();

  if (isMoving && hasMovedEnough()) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    createImage();
    return;
  }



  
};

const createImage = () => {
  const img = document.createElement("img");
  img.classList.add("trail-img");

  const randomIndex = Math.floor(Math.random() * images.length);
  const rotation = (Math.random() - 0.5) * 50;
  img.src = images[randomIndex];

  const rect = container.getBoundingClientRect();
  const relativeX = mouseX - rect.left;
  const relativeY = mouseY - rect.top;
  img.style.left = `${relativeX}px`;
  img.style.top = `${relativeY}px`;
  img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
  img.style.transition = `transform ${config.inDuration}ms ${config.inEasing} `;  //   opacity ${config.outDuration}ms ${config.outEasing}`;
    container.appendChild(img);

    setTimeout(() => {
        img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    }, 10);
    trail.push({ 
        element: img, 
        rotation: rotation,
        removeTime: Date.now() + config.imageLifespan,
    });

};
const createScrollTrailImage = () => {
  if (!isCursorInContainer) return;

  lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
  lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);

  createImage();

  lastMouseX = mouseX;
  lastMouseY = mouseY;
};

const removeOldImages = () => {
  const now = Date.now();
  if (now - lastRemovalTime < config.removlalDelay || trail.length===0) return;
  const oldestImage = trail[0];
    if (now > oldestImage.removeTime) {
        const imgToRemove = trail.shift();
        imgToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`; // opacity ${config.outDuration}ms ${config.outEasing}`;
        imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

        lastRemovalTime = now;
        setTimeout(() => {

            if(imgToRemove.element.parentNode) {
                imgToRemove.element.parentNode.removeChild(imgToRemove.element);}}, config.outDuration);}};
            document.addEventListener("mousemove", (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                isCursorInContainer = isInContainer(mouseX, mouseY);
                if(isCursorInContainer){
                    isMoving = true;
                    clearTimeout(window.moveTimeout);
                    window.moveTimeout = setTimeout(() => { isMoving = false;}, 100);}});

                    window.addEventListener("scroll", () => {
                        isCursorInContainer = isInContainer(mouseX, mouseY);
                        if(isCursorInContainer){
                            isMoving = true;
                            lastMouseX +=(Math.random() - 0.5) * 10;

                            clearTimeout(window.scrollTimeout);
                            window.scrollTimeout = setTimeout(() => { isMoving = false;}, 100);
                        }
                    },
                        {passive:false}
                    );

                    window.addEventListener("scroll", () => {
                        const now = Date.now();
                        isScrolling = true;
                        if (now - lastScrollTime < config.scrollThreshold) return
                    lastScrollTime = now;    
                    if (!scrollTicking) {
                        requestAnimationFrame(() => {
                            if(isScrolling) {
                                createScrollTrailImage();
                                isScrolling = false;
                            }
                            scrollTicking = false;
                    });
                    scrollTicking = true;
                }
            }, {passive:true});

            const animate = () => {  //(time)
                createTrailImage();
                removeOldImages();
                requestAnimationFrame(animate);
            };
            animate();



// part2


lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { 
    lenis.raf(time*1000);
});
gsap.ticker.lagSmoothing(0); //no lag
        
const bannerContainer = document.querySelector(".banner-img-container");
const bannerIntroTextElements = gsap.utils.toArray(".banner-intro-text");
const bannerMaskLayers = gsap.utils.toArray(".img-mask ");  //.mask

const bannerHeader = document.querySelector(".banner-header h1");
const splitText = new SplitText(bannerHeader, { type: "words" });
const words = splitText.words;

gsap.set(words, { opacity: 0 });

bannerMaskLayers.forEach((layer, i) => {
  gsap.set(layer, { scale: 0.9 + i * 0.15 }); // mask
});

gsap.set(bannerContainer, { scale: 0 });



ScrollTrigger.refresh()



// part3
});


document.addEventListener("DOMContentLoaded",()=>{
// const lenis = new Lenis({autoRaf:true});
const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger, SplitText);

})