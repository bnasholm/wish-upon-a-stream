import {
  fetchHomePageData,
  fetchRefData,
  delay,
  isValidURL,
  checkElementInView,
  handleCarouselAnimation,
} from "./ts";
import { ContentData, Container, Item } from "./types";
import {
  ASPECT_RATIO,
  CAROUSEL_IMG_1,
  CAROUSEL_IMG_2,
  CAROUSEL_IMG_3,
  DISNEY_PLUS_LOGO,
  FALL_BACK_IMG,
} from "./constants";

/* ------------------ FETCH DATA ----------------------------*/

/* renders loading screen while fetching homppage data, then adds
 * the fetched data to elements on the DOM
 * lastly, initializes the Intersection Observer to watch for when
 * elements are scrolled into view to lazily load those dynamic sets
 */
const fetchAndRenderHomePageData = async () => {
  try {
    renderLoadingScreen();
    const data: ContentData = await fetchHomePageData();
    if (data) {
      const containers = data.StandardCollection.containers;
      const appContainer = document.querySelector("#app");
      const mainContent = document.createElement("div");
      mainContent.id = "main-content";
      appContainer?.appendChild(mainContent);
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      const newModalContent = document.createElement("div");
      newModalContent.className = "modal";
      modalContainer.appendChild(newModalContent);
      appContainer?.appendChild(modalContainer);
      renderDefaultContent(containers);
    }
    const firstTile = document.querySelector(".tile-wrapper");
    (firstTile as HTMLElement).focus();
    window.moveTo(0, 0);
    initializeObserver();
  } catch (e) {
    console.error("Error fetching home page data:", e);
    renderErrorScreen();
  }
};

/* renders the dynamic ref content by making additional
 * call to fetch by refId
 */
const fetchAndRenderDynamicData = async (refId: string) => {
  const data: any = await fetchRefData(refId);
  if (data) {
    const set =
      data.CuratedSet ??
      data.TrendingSet ??
      data.PersonalizedCuratedSet ??
      undefined;
    if (!!set) renderDynamicContent(refId, set);
  }
};

/* sets up Observer so we can dynamically load the ref sections when scrolled into view */
const initializeObserver = () => {
  const allSections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const refId = target.dataset.refId;
          if (refId) fetchAndRenderDynamicData(refId);
          observer.unobserve(target);
        }
      });
    },
    // when 50% of element is visible
    { threshold: 0.5 }
  );

  allSections.forEach((section) => observer.observe(section));
};

/* ------------------ RENDER CONTENT ------------------------*/

/* render nav bar which contains logo and a user */
const renderNavBar = () => {
  const appContainer = document.getElementById("app");
  const navBar = document.createElement("div");
  navBar.id = "nav-bar";
  const logo = document.createElement("img");
  logo.id = "disney-logo-small";
  logo.src = DISNEY_PLUS_LOGO;
  const profileIcon = document.createElement("div");
  profileIcon.className = "profile-icon";
  const initials = document.createElement("p");
  initials.textContent = "BN";
  profileIcon.appendChild(initials);
  navBar.appendChild(logo);
  navBar.appendChild(profileIcon);
  appContainer?.appendChild(navBar);
};

/* render  carousel that rotates between 3 images to
 * advertise what is new on app
 */
const renderCarouselContent = () => {
  const appContainer = document.getElementById("app");
  const carouselElement = document.createElement("div");
  carouselElement.innerHTML = `<div class="carousel-container">
        <div class="carousel-track">
            <div class="carousel-slide">
              <img src=${CAROUSEL_IMG_1} alt="Image 1" />
              <img src=${CAROUSEL_IMG_2} alt="Image 2" />
              <img src=${CAROUSEL_IMG_3} alt="Image 3" />
            </div>
        </div>
    </div>`;
  appContainer?.appendChild(carouselElement);
  handleCarouselAnimation();
};

/* renders loading screen that displays for set period of time while data is loading
 *  Disney logo fades in and out
 */
const renderLoadingScreen = () => {
  const appContainer = document.getElementById("app");
  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loading-screen";
  const logo = document.createElement("img");
  logo.id = "disney-logo";
  logo.src = DISNEY_PLUS_LOGO;
  loadingScreen.appendChild(logo);
  appContainer?.appendChild(loadingScreen);
};

/* renders error screen if an error is caught
 * includes button to refresh page on Enter key
 */
const renderErrorScreen = () => {
  const appContainer = document.getElementById("app");
  const errorScreen = document.createElement("div");
  errorScreen.id = "error-screen";
  const errorMessage = document.createElement("div");
  errorMessage.id = "error-message";
  const oopsHeading = document.createElement("h1");
  oopsHeading.textContent = "Oops, something went wrong.";
  const additionalText = document.createElement("p");
  additionalText.textContent =
    "Please try again. If the problem persists, visit our help center at help.disneyplus.com.";
  const button = document.createElement("button");
  const buttonText = document.createElement("p");
  buttonText.textContent = "Retry";
  button.appendChild(buttonText);
  errorMessage.appendChild(oopsHeading);
  errorMessage.appendChild(additionalText);
  errorMessage.appendChild(button);
  errorScreen.appendChild(errorMessage);
  appContainer?.appendChild(errorScreen);
};

/* renders individual thumbnail tile image and if applicable, video
 * video plays on tile focus and stops when unfocused
 * image opacity is hidden when video is playing and vice versa
 * element is an anchor tag that opens modal on Enter
 */
const renderTile = (tile: Item) => {
  const tileInfo = tile.image.tile[ASPECT_RATIO];
  const urlWrapper =
    tileInfo.series?.default ??
    tileInfo.program?.default ??
    tileInfo.default?.default ??
    undefined;
  if (urlWrapper) {
    const newTileWrapper = document.createElement("a");
    const title =
      tile?.text?.title?.full?.series?.default ??
      tile?.text?.title?.full?.program?.default ??
      tile?.text?.title?.full?.default?.default ??
      undefined;
    newTileWrapper.id = tile.contentId || tile.collectionId || "";
    if (title?.content) newTileWrapper.dataset.title = title.content;
    newTileWrapper.tabIndex = 0;
    newTileWrapper.className = "tile-wrapper";
    const newTileImage = document.createElement("img");
    const hasValidImage = !!urlWrapper.url && isValidURL(urlWrapper.url);
    newTileImage.src = hasValidImage ? urlWrapper.url : "";
    newTileImage.className = "media-img";
    const newSourceElement = document.createElement("source");
    const videoSrc =
      tile.videoArt &&
      tile.videoArt.length > 0 &&
      tile.videoArt[0].mediaMetadata?.urls &&
      tile.videoArt[0].mediaMetadata?.urls.length > 0
        ? tile.videoArt[0]?.mediaMetadata?.urls[0].url
        : undefined;
    const hasVideo = !!videoSrc;
    newSourceElement.src = !!videoSrc ? videoSrc : "";
    newSourceElement.type = "video/mp4";
    const newVideoElement = document.createElement("video");
    newVideoElement.className = "media-video";
    newVideoElement.appendChild(newSourceElement);
    newVideoElement.muted = true;
    newVideoElement.loop = true;
    // allows proper positioning for video to play over top
    if (hasVideo) newTileImage.classList.add("has-video");
    // only append child tile on successful load of thumbnail
    newTileImage.onload = () => {
      newTileWrapper.appendChild(newTileImage);
      if (hasVideo) newTileWrapper.appendChild(newVideoElement);
    };
    // if image fails to load display fall back image and append title over top
    newTileImage.onerror = (e) => {
      console.warn("Error fetching image thumbnail", e);
      newTileImage.src = FALL_BACK_IMG;
      const titleElement = document.createElement("p");
      titleElement.className = "fallback-img-title";
      if (title && title?.content) titleElement.textContent = title.content;
      newTileWrapper.appendChild(titleElement);
    };
    if (hasVideo) {
      newTileWrapper.onfocus = () => {
        // hide thumbnail, show video
        const titleElement = newTileWrapper.querySelector(
          ".fallback-img-title"
        ) as HTMLElement;
        if (titleElement) titleElement.style.opacity = "0";
        newTileImage.style.opacity = "0";
        newVideoElement.style.opacity = "1";
        newVideoElement.play().catch((e) => {
          console.warn("Error playing video", e);
        });
      };
      newVideoElement.onerror = (e) => console.warn("Error fetching video", e);
      newTileWrapper.onblur = async () => {
        newVideoElement.pause();
        newVideoElement.currentTime = 0;
        // hide video, show thumbnail img
        const titleElement = newTileWrapper.querySelector(
          ".fallback-img-title"
        ) as HTMLElement;
        if (titleElement) titleElement.style.opacity = "1";
        newTileImage.style.opacity = "1";
        newVideoElement.style.opacity = "0";
      };
    }
    return newTileWrapper;
  }
};

/* takes in row items and renders the row
 * a row is a section of content such as "New to Disney+"
 * each row consists of thumbnail tiles
 */
const renderSection = (section: Container) => {
  const newSection = document.createElement("section");
  newSection.id =
    (section.set.type === "ShelfContainer" || section.set.type === "CuratedSet"
      ? section.set.setId
      : section.set.refId) || "";
  const newHeading = document.createElement("h2");
  newHeading.className = "heading";
  newHeading.textContent = section.set.text.title.full.set.default.content;
  newSection.appendChild(newHeading);
  const tileSection = document.createElement("div");
  tileSection.className = "tile-section";
  const fragment = document.createDocumentFragment();
  if (section.set.items) {
    section.set.items.forEach((item: Item) => {
      try {
        const tileWrapper = renderTile(item);
        if (tileWrapper) fragment.appendChild(tileWrapper);
      } catch (e) {
        console.error("Error rendering tile:", e);
      }
    });
  }
  tileSection.appendChild(fragment);
  if (section.set.refId) {
    newSection.dataset.refId = section.set.refId;
  }
  newSection.appendChild(tileSection);
  return newSection;
};

/* renders the content inside of modal
 * when thumbnail is selected, modal opens and shows
 * larger size video and info about the selection
 */
const renderModalContent = (element: HTMLElement) => {
  const modal = document.querySelector(".modal");
  const newDiv = document.createElement("div");
  const headingElement = document.createElement("h1");
  const descriptionElement = document.createElement("p");
  descriptionElement.textContent =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Dapibus bibendum hendrerit sem semper lorem sollicitudin viverra pretium. Ridiculus elementum potenti lacus hac cursus fringilla morbi nibh.";
  const videoContainerElement = document.createElement("div");
  videoContainerElement.id = "modal-video-container";
  const newSourceElement = document.createElement("source");
  const title = element.dataset.title;
  const videoSrc =
    (element.querySelector(".media-video > source") as HTMLSourceElement)
      ?.src || undefined;
  newSourceElement.src = !!videoSrc ? videoSrc : "";
  newSourceElement.type = "video/mp4";
  const videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.classList.add("media-video");
  videoElement.classList.add("no-focus");
  videoElement.appendChild(newSourceElement);
  videoElement.muted = false;
  videoElement.preload = "auto";
  headingElement.textContent = title || "";
  videoContainerElement.appendChild(videoElement);
  newDiv.id = "modal-content";
  newDiv.dataset.contentId = element.id;
  newDiv.appendChild(headingElement);
  if (!!videoSrc) newDiv.appendChild(videoContainerElement);
  newDiv.appendChild(descriptionElement);
  modal?.appendChild(newDiv);
  // if there is no video, focus on the description element instead
  if (!!videoSrc) videoElement.focus();
  else descriptionElement.focus();
};

/* renders the "dynamic" content "ref" sets
 * checks if there is an existing section and appends
 * the new data to their appropriate section
 * when this is called, we have already rendered the set
 * section and heading, but content within section isn't
 * fetched until scrolled into view
 */
const renderDynamicContent = (refId: string, data: any) => {
  const existingSection = document.querySelector(
    `[data-ref-id = '${refId}'] > .tile-section`
  );
  data.items?.forEach((item: any) => {
    const tileWrapper = renderTile(item);
    if (tileWrapper) existingSection?.appendChild(tileWrapper);
  });
};

/* loops through hompage data to create sections and
 * add those secitons to the main app container
 */
const renderDefaultContent = (data: Container[]) => {
  const mainContent = document.querySelector("#main-content");
  data.forEach((container: Container) => {
    const newSection = renderSection(container);
    mainContent?.appendChild(newSection);
  });
};

/* ------------------ HANDLE EVENTS ------------------------*/

/* handle navigation between the tiles using keydown events
 *  focus on [left / right / top / bottom] most tile unless it's at
 *  the [start / end / top / bottom] of section
 *  only navigate to next tile if modal is not open
 *  uses getBoundingRect to move to above or below tile in case where
 *  other section has been scrolled
 */
const handleKeydownEvents = () => {
  document.addEventListener("keydown", (event) => {
    const focusedElement = document.activeElement as HTMLElement;
    const modal = document.querySelector(".modal-container");
    const isModalOpen = modal?.classList.contains("modal-open");
    const allSections = document.querySelectorAll(".tile-section");
    const currentSection = focusedElement?.closest(".tile-section");
    const currentSectionIndex = currentSection
      ? Array.from(allSections).indexOf(currentSection)
      : 0;
    const currentItemIndex = focusedElement
      ? Array.from(currentSection?.childNodes || []).indexOf(focusedElement)
      : 0;
    const prevSection = allSections[currentSectionIndex - 1];
    const nextSection = allSections[currentSectionIndex + 1];

    switch (event.key) {
      // focus on [left / right / top / bottom] most tile unless it's at
      // the [start / end / top / bottom] of section
      // only navigate to next tile if modal is not open
      case "ArrowLeft":
        const prevSibling =
          focusedElement?.previousElementSibling as HTMLElement;
        if (prevSibling && !isModalOpen) {
          prevSibling.focus();
          checkElementInView(prevSibling);
        }
        break;
      case "ArrowRight":
        const nextSibling = focusedElement?.nextElementSibling as HTMLElement;
        if (nextSibling && !isModalOpen) {
          checkElementInView(nextSibling);
          nextSibling.focus();
        }
        break;
      case "ArrowDown":
        if (currentSectionIndex < allSections.length - 1 && !isModalOpen)
          handleUpDownNavigation(focusedElement, nextSection as HTMLElement);
        break;
      case "ArrowUp":
        if (currentSectionIndex > 0 && !isModalOpen)
          handleUpDownNavigation(focusedElement, prevSection as HTMLElement);
        break;
      case "Enter":
        if (!isModalOpen) handleModalOpen(focusedElement);
        break;
      case "Backspace":
        handleModalClose();
        break;
      default:
        break;
    }
  });
};

/* handles up/ down navigation using getBoundingRect if above section has been scrolled
 * passes in section above or below, checks the horizontal distance of every a element
 * in that section and finds the closest one and focuses it
 * */
const handleUpDownNavigation = (
  focusedElement: HTMLElement,
  prevSection: HTMLElement
) => {
  const focusableElements = Array.from(
    prevSection.querySelectorAll(".tile-wrapper")
  ) as HTMLElement[];
  let closestElement: HTMLElement | null = null;
  let minDistance = Infinity;
  const currentRect = focusedElement.getBoundingClientRect();
  let currentCenterX = currentRect.left + currentRect.width / 2;
  focusableElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    let horizontalDistance = Math.abs(currentCenterX - elementCenterX);
    if (horizontalDistance < minDistance) {
      minDistance = horizontalDistance;
      closestElement = element;
    }
  });
  if (closestElement) {
    (closestElement as HTMLElement).focus();
  }
};

/* handles opening modal, if video is playing, stop play and reset
 * timer,display modal and content inside modal and add backdrop to
 * main app container
 */
const handleModalOpen = (focusedElement: HTMLElement) => {
  const mainContent = document.getElementById("main-content");
  const modal = document.querySelector(".modal-container");
  const textTitle = document.querySelector(
    ".fallback-img-title"
  ) as HTMLElement;
  // if video is playing, stop
  const videoElement = focusedElement?.querySelector(
    ".media-video"
  ) as HTMLVideoElement;
  const imageElement = focusedElement?.querySelector(
    ".media-img"
  ) as HTMLImageElement;
  if (videoElement) {
    videoElement.pause();
    videoElement.currentTime = 0;
    // hide video, show thumbnail img
    if (textTitle) textTitle.style.opacity = "1";
    imageElement.style.opacity = "1";
    videoElement.style.opacity = "0";
  }
  renderModalContent(focusedElement);
  modal?.classList.add("modal-open");
  mainContent?.classList.add("modal-backdrop");
  checkElementInView(modal as HTMLElement);
};

/* handles closing modal, removing backdrop and updating
 * modal to be display: none;
 */
const handleModalClose = () => {
  const mainContent = document.getElementById("main-content");
  const modal = document.querySelector(".modal");
  const modalContainer = document.querySelector(".modal-container");
  const modalContent = document.getElementById("modal-content");
  const contentId = modalContent?.dataset.contentId;
  // focus on the element we previously selected
  if (contentId) {
    const thumbnail = document.getElementById(contentId);
    thumbnail?.focus();
  }
  // if there is something in the modal, remove it on close
  if (modalContent) modal?.removeChild(modalContent);
  modalContainer?.classList.remove("modal-open");
  mainContent?.classList.remove("modal-backdrop");
};

/* -------------------- MAIN APP ----------------------------*/
renderNavBar();
renderCarouselContent();
fetchAndRenderHomePageData()
  .then(
    () =>
      delay(3000).then(() => {
        // fade loading screen
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) loadingScreen.style.opacity = "0";
      }),
    () => {
      renderErrorScreen();
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) loadingScreen.style.opacity = "0";
    }
  )
  .finally(() => window.scrollTo(0, 0));
handleKeydownEvents();
