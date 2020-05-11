(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ingress/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/fanout/index.js":
/*!*****************************!*\
  !*** ./src/fanout/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _webhook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./webhook */ \"./src/fanout/webhook.js\");\n/* harmony import */ var _lambda__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lambda */ \"./src/fanout/lambda.js\");\n/* harmony import */ var _sms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sms */ \"./src/fanout/sms.js\");\n/* harmony import */ var _unimplemented__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unimplemented */ \"./src/fanout/unimplemented.js\");\n\n\n\n\nconst fanoutHandlers = {\n  webhook: _webhook__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  lambda: _lambda__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  sms: _sms__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  '*': _unimplemented__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (async ({\n  id,\n  type,\n  payload\n}) => {\n  try {\n    await (fanoutHandlers[type] || fanoutHandlers['*'])(payload);\n  } catch (e) {\n    console.error(JSON.stringify({\n      id,\n      message: e.message,\n      stack: e.stack\n    }, null, 2));\n  }\n});\n\n//# sourceURL=webpack:///./src/fanout/index.js?");

/***/ }),

/***/ "./src/fanout/lambda.js":
/*!******************************!*\
  !*** ./src/fanout/lambda.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);\n\nconst L = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.Lambda({\n  apiVersion: '2015-03-31'\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (async ({\n  name,\n  ...rest\n}) => L.invoke({\n  FunctionName: name,\n  Payload: JSON.stringify(rest),\n  InvocationType: 'Event'\n}).promise());\n\n//# sourceURL=webpack:///./src/fanout/lambda.js?");

/***/ }),

/***/ "./src/fanout/sms.js":
/*!***************************!*\
  !*** ./src/fanout/sms.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SNS = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.SNS({\n  apiVersion: '2010-03-31'\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (async ({\n  phone,\n  message,\n  ...rest\n}) => {\n  // Set correct smsType\n  await SNS.setSMSAttributes({\n    attributes: {\n      DefaultSMSType: 'Transactional'\n    }\n  }).promise();\n  return SNS.publish({\n    PhoneNumber: phone,\n    Message: typeof message === 'string' ? message : JSON.stringify(message)\n  }).promise();\n});\n\n//# sourceURL=webpack:///./src/fanout/sms.js?");

/***/ }),

/***/ "./src/fanout/unimplemented.js":
/*!*************************************!*\
  !*** ./src/fanout/unimplemented.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (async payload => {\n  console.error('Not implemented', payload);\n});\n\n//# sourceURL=webpack:///./src/fanout/unimplemented.js?");

/***/ }),

/***/ "./src/fanout/webhook.js":
/*!*******************************!*\
  !*** ./src/fanout/webhook.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n // Pull out specifically applies to this fanout type\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (async ({\n  url,\n  method,\n  data,\n  params,\n  headers\n}) => axios__WEBPACK_IMPORTED_MODULE_0___default()({\n  url,\n  method,\n  data,\n  params,\n  headers\n}));\n\n//# sourceURL=webpack:///./src/fanout/webhook.js?");

/***/ }),

/***/ "./src/ingress/index.js":
/*!******************************!*\
  !*** ./src/ingress/index.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _fanout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fanout */ \"./src/fanout/index.js\");\n/* harmony import */ var _utils_hash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/hash */ \"./src/utils/hash.js\");\n/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../registry */ \"./src/registry/index.js\");\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (async ({\n  hid,\n  type,\n  payload = {}\n}) => {\n  // Get keyed consumers\n  const consumers = await _registry__WEBPACK_IMPORTED_MODULE_3__[\"default\"].query({\n    hid: hid || Object(_utils_hash__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(type)\n  }); // Merge incoming payload with possible consumer defaults\n\n  const consumerEvents = consumers.map(it => Object(lodash__WEBPACK_IMPORTED_MODULE_0__[\"merge\"])(it, {\n    payload\n  })); // fanout\n\n  const results = await Promise.all(consumerEvents.map(_fanout__WEBPACK_IMPORTED_MODULE_1__[\"default\"]));\n  return results.filter(Boolean);\n});\n\n//# sourceURL=webpack:///./src/ingress/index.js?");

/***/ }),

/***/ "./src/registry/index.js":
/*!*******************************!*\
  !*** ./src/registry/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _teleology_dynamo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teleology/dynamo */ \"@teleology/dynamo\");\n/* harmony import */ var _teleology_dynamo__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_teleology_dynamo__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_teleology_dynamo__WEBPACK_IMPORTED_MODULE_0___default()({\n  table: process.env.EVENT_TABLE,\n  key: 'id',\n  indexes: [{\n    key: 'hid',\n    name: 'HashGSI'\n  }]\n}));\n\n//# sourceURL=webpack:///./src/registry/index.js?");

/***/ }),

/***/ "./src/utils/hash.js":
/*!***************************!*\
  !*** ./src/utils/hash.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (v => crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createHash('sha1').update(JSON.stringify(v)).digest('hex'));\n\n//# sourceURL=webpack:///./src/utils/hash.js?");

/***/ }),

/***/ "@teleology/dynamo":
/*!************************************!*\
  !*** external "@teleology/dynamo" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@teleology/dynamo\");\n\n//# sourceURL=webpack:///external_%22@teleology/dynamo%22?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");\n\n//# sourceURL=webpack:///external_%22aws-sdk%22?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ })

/******/ })));