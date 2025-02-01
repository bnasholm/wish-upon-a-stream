"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const { data } = yield response.json();
            return data;
            //  console.log(data);
        }
        catch (error) {
            // console.error('Error fetching data:', error);
        }
    });
}
function fetchAndRender() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData();
        if (data)
            renderData(data);
    });
}
/* const aspectRatios = [0.67, 0.71, 0.75, 1.78, 2.29, 3.00, 3.91];

function getClosestAspectRatio(ratio) {
  return aspectRatios.reduce((prev, curr) =>
    Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev
  );
} */
function renderData(data) {
    const appContainer = document.getElementById('app');
    data.StandardCollection.containers.forEach((container) => {
        var _a;
        const newSection = document.createElement('section');
        const newHeading = document.createElement('h2');
        newHeading.className = 'heading';
        newHeading.textContent = container.set.text.title.full.set.default.content;
        newSection.appendChild(newHeading);
        const tileSection = document.createElement('div');
        tileSection.className = 'tile-section';
        const aspectRatio = 1.78;
        (_a = container.set.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            var _a, _b, _c, _d;
            const tileInfo = item.image.tile[aspectRatio];
            const urlWrapper = (_d = (_b = (_a = tileInfo.series) === null || _a === void 0 ? void 0 : _a.default) !== null && _b !== void 0 ? _b : (_c = tileInfo.program) === null || _c === void 0 ? void 0 : _c.default) !== null && _d !== void 0 ? _d : undefined;
            if (urlWrapper) {
                const newTileWrapper = document.createElement('a');
                newTileWrapper.className = 'tile-wrapper';
                const newTileImage = document.createElement('img');
                newTileImage.src = urlWrapper.url;
                newTileImage.className = 'tile';
                // only append child tile on successful load of thumbnail
                newTileImage.onload = () => {
                    newTileWrapper.appendChild(newTileImage);
                    tileSection.appendChild(newTileWrapper);
                    newTileImage.focus();
                };
            }
        });
        newSection.appendChild(tileSection);
        appContainer === null || appContainer === void 0 ? void 0 : appContainer.appendChild(newSection);
    });
}
fetchAndRender();
