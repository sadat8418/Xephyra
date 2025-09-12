import { ScrollTrigger } from "gsap/all";
import { SplitText } from "gsap/all";

document.addEventListener("DOMContentLoaded",()=>{
// const lenis = new Lenis({autoRaf:true});
const lenis = new Lenis();
//   duration: 1.2,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   smooth: true,
// });

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);
//  //added 


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

//   if (!isMoving && now - lastSteadyImageTime > config.idleCursorInterval) {
//     lastSteadyImageTime = now;
//     // createImage();
//   }

  
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

gsap.registerPlugin(ScrollTrigger, SplitText);
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

ScrollTrigger.create({
  trigger: ".banner",
  start: "top top",
  end: `+=${window.innerHeight * 4}px`,
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

}); 