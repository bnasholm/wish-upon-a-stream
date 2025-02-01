/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function() {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nfunction fetchData() {\n    return __awaiter(this, void 0, void 0, function* () {\n        try {\n            const response = yield fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json');\n            if (!response.ok) {\n                throw new Error(`HTTP error! Status: ${response.status}`);\n            }\n            const { data } = yield response.json();\n            return data;\n            //  console.log(data);\n        }\n        catch (error) {\n            // console.error('Error fetching data:', error);\n        }\n    });\n}\nfunction fetchAndRender() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const data = yield fetchData();\n        if (data)\n            renderData(data);\n    });\n}\n/* const aspectRatios = [0.67, 0.71, 0.75, 1.78, 2.29, 3.00, 3.91];\n\nfunction getClosestAspectRatio(ratio) {\n  return aspectRatios.reduce((prev, curr) =>\n    Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev\n  );\n} */\nfunction renderData(data) {\n    const appContainer = document.getElementById('app');\n    data.StandardCollection.containers.forEach((container) => {\n        var _a;\n        const newSection = document.createElement('section');\n        const newHeading = document.createElement('h2');\n        newHeading.className = 'heading';\n        newHeading.textContent = container.set.text.title.full.set.default.content;\n        newSection.appendChild(newHeading);\n        const tileSection = document.createElement('div');\n        tileSection.className = 'tile-section';\n        const aspectRatio = 1.78;\n        (_a = container.set.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => {\n            var _a, _b, _c, _d;\n            const tileInfo = item.image.tile[aspectRatio];\n            const urlWrapper = (_d = (_b = (_a = tileInfo.series) === null || _a === void 0 ? void 0 : _a.default) !== null && _b !== void 0 ? _b : (_c = tileInfo.program) === null || _c === void 0 ? void 0 : _c.default) !== null && _d !== void 0 ? _d : undefined;\n            if (urlWrapper) {\n                const newTileWrapper = document.createElement('a');\n                newTileWrapper.className = 'tile-wrapper';\n                const newTileImage = document.createElement('img');\n                newTileImage.src = urlWrapper.url;\n                newTileImage.className = 'tile';\n                // only append child tile on successful load of thumbnail\n                newTileImage.onload = () => {\n                    newTileWrapper.appendChild(newTileImage);\n                    tileSection.appendChild(newTileWrapper);\n                    newTileImage.focus();\n                };\n            }\n        });\n        newSection.appendChild(tileSection);\n        appContainer === null || appContainer === void 0 ? void 0 : appContainer.appendChild(newSection);\n    });\n}\nfetchAndRender();\n\n\n//# sourceURL=webpack://wishuponastream/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;