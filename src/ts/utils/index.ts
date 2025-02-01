/* delay so we can have a loading screen */
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/* check if resource url is valid */
export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/* check if focused element is cut off so we can scroll into view if so */
export const checkElementInView = (element: HTMLElement) => {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const isCutOff = rect.bottom > window.innerHeight || rect.top < 0;
  if (isCutOff) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

export const handleCarouselAnimation = () => {
  const track = document.querySelector(".carousel-track") as HTMLElement;
  const slides = document.querySelector(".carousel-slide")?.children;
  let index = 0;
  const totalSlides = slides?.length || 0;
  let slideInterval: any;

  const nextSlide = () => {
    index = (index + 1) % totalSlides;
    // move slide track over 101% each time
    if (track) track.style.transform = `translateX(-${index * 101}%)`;
  };

  const beginSlideshow = () => {
    // stopSlideshow();
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlideshow = () => clearInterval(slideInterval);

  beginSlideshow();
  // remove slide interval on cleanup
  window.addEventListener("beforeunload", stopSlideshow);
};
