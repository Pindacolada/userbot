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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var telegram_1 = require("telegram");
var sessions_1 = require("telegram/sessions");
var events_1 = require("telegram/events");
var Weather = require("weather");
var tesseract_js_1 = require("tesseract.js");
var vision_1 = require("@google-cloud/vision");
//import config from "../config/config.json";
//import localisation from "../config/localisation.json";
var localisation = require("../config/localisation.json");
var config = require("../config/config.json");
var visionClient = new vision_1["default"].ImageAnnotatorClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = './userbotGoogleAuth.json';
var appID = config.appID;
var appCode = config.appCode;
var weather = new Weather({ appID: appID, appCode: appCode });
var apiID = config.apiID;
var apiHash = config.apiHash;
var stringSession = config.stringSession;
function eventPrint(event) {
    return __awaiter(this, void 0, void 0, function () {
        var message, buffer, text, buffer, labelAnnotations, combinedLabels_1, buffer, nsfwAnnotations, buffer, faceAnnotations, text_1, buffer, landmark, text_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = event.message;
                    if (!(message.senderId == 1194948996 || message.senderId)) return [3 /*break*/, 46];
                    if (!(message.text == '.otter')) return [3 /*break*/, 2];
                    return [4 /*yield*/, message.reply({ message: "\uD83E\uDDA6".repeat(Math.floor(Math.random() * 10)) })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (message.text.match(/^\.weather \w+$/i) !== null) {
                        return [2 /*return*/, getWeatherMessage(message)];
                    }
                    if (!(message.text == '.ocr')) return [3 /*break*/, 11];
                    return [4 /*yield*/, getImageBuffer(message)];
                case 3:
                    buffer = _a.sent();
                    if (!buffer) return [3 /*break*/, 9];
                    return [4 /*yield*/, getOCRText(buffer)];
                case 4:
                    text = _a.sent();
                    if (!text) return [3 /*break*/, 6];
                    return [4 /*yield*/, message.reply({ message: text })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, message.reply({ message: 'No text found :/' })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, message.reply({ message: 'No image found :/' })];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    if (!(message.text == '.what')) return [3 /*break*/, 20];
                    return [4 /*yield*/, getImageBuffer(message)];
                case 12:
                    buffer = _a.sent();
                    if (!buffer) return [3 /*break*/, 18];
                    return [4 /*yield*/, getLabelAnnotations(buffer)];
                case 13:
                    labelAnnotations = _a.sent();
                    if (!labelAnnotations) return [3 /*break*/, 15];
                    combinedLabels_1 = '';
                    labelAnnotations.forEach(function (label) { return combinedLabels_1 += label.description + '\n'; });
                    return [4 /*yield*/, message.reply({ message: combinedLabels_1 })];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, message.reply({ message: 'No labels annotations found :/' })];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17: return [3 /*break*/, 20];
                case 18: return [4 /*yield*/, message.reply({ message: 'No image found :/' })];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20:
                    if (!(message.text.match(/^\.isnsfw$/i) !== null)) return [3 /*break*/, 29];
                    return [4 /*yield*/, getImageBuffer(message)];
                case 21:
                    buffer = _a.sent();
                    if (!buffer) return [3 /*break*/, 27];
                    return [4 /*yield*/, getNSFWAnnotations(buffer)];
                case 22:
                    nsfwAnnotations = _a.sent();
                    if (!((nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.adult) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.medical) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.spoof) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.violence) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.racy))) return [3 /*break*/, 24];
                    return [4 /*yield*/, message.reply({ message: "Adult: " + localisation[nsfwAnnotations.adult] + "\nMedical: " + localisation[nsfwAnnotations.medical] + "\nSpoof: " + localisation[nsfwAnnotations.spoof] + "\nViolence: " + localisation[nsfwAnnotations.violence] + "\nRacy: " + localisation[nsfwAnnotations.racy] })];
                case 23:
                    _a.sent();
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, message.reply({ message: 'No face annotations found :/' })];
                case 25:
                    _a.sent();
                    _a.label = 26;
                case 26: return [3 /*break*/, 29];
                case 27: return [4 /*yield*/, message.reply({ message: 'No image found :/' })];
                case 28:
                    _a.sent();
                    _a.label = 29;
                case 29:
                    if (!(message.text.match(/^\.face$/i) !== null)) return [3 /*break*/, 37];
                    return [4 /*yield*/, getImageBuffer(message)];
                case 30:
                    buffer = _a.sent();
                    if (!buffer) return [3 /*break*/, 35];
                    return [4 /*yield*/, getFaceAnnotations(buffer)];
                case 31:
                    faceAnnotations = _a.sent();
                    if (!((faceAnnotations === null || faceAnnotations === void 0 ? void 0 : faceAnnotations.length) == 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, message.reply({ message: 'No face detected :/' })];
                case 32: return [2 /*return*/, _a.sent()];
                case 33:
                    text_1 = '';
                    faceAnnotations === null || faceAnnotations === void 0 ? void 0 : faceAnnotations.forEach(function (face, i) {
                        if (face.joyLikelihood && face.angerLikelihood && face.sorrowLikelihood && face.surpriseLikelihood) {
                            text_1 += "Face " + (i + 1) + ":\nJoy: " + localisation[face.joyLikelihood] + "\nAnger: " + localisation[face.angerLikelihood] + "\nSorrow: " + localisation[face.sorrowLikelihood] + "\nSurprise: " + localisation[face.surpriseLikelihood] + "\n";
                        }
                    });
                    return [4 /*yield*/, message.reply({ message: text_1 })];
                case 34:
                    _a.sent();
                    return [3 /*break*/, 37];
                case 35: return [4 /*yield*/, message.reply({ message: 'No image found :/' })];
                case 36:
                    _a.sent();
                    _a.label = 37;
                case 37:
                    if (!(message.text.match(/^\.landmark$/i) !== null)) return [3 /*break*/, 46];
                    return [4 /*yield*/, getImageBuffer(message)];
                case 38:
                    buffer = _a.sent();
                    if (!buffer) return [3 /*break*/, 44];
                    return [4 /*yield*/, getLandmark(buffer)];
                case 39:
                    landmark = _a.sent();
                    console.log(landmark === null || landmark === void 0 ? void 0 : landmark.length);
                    if (!((landmark === null || landmark === void 0 ? void 0 : landmark.length) == 0)) return [3 /*break*/, 41];
                    return [4 /*yield*/, message.reply({ message: 'No Landmarks detected :/' })];
                case 40: return [2 /*return*/, _a.sent()];
                case 41:
                    if (!landmark) return [3 /*break*/, 43];
                    text_2 = '';
                    landmark.forEach(function (item, i) {
                        if (item === null || item === void 0 ? void 0 : item.description) {
                            if (text_2.match(item.description) == null) {
                                text_2 += i + 1 + ". " + item.description + "\n";
                            }
                        }
                    });
                    return [4 /*yield*/, message.reply({ message: text_2 })];
                case 42:
                    _a.sent();
                    _a.label = 43;
                case 43: return [3 /*break*/, 46];
                case 44: return [4 /*yield*/, message.reply({ message: 'No image found :/' })];
                case 45:
                    _a.sent();
                    _a.label = 46;
                case 46: return [2 /*return*/];
            }
        });
    });
}
var getImageBuffer = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var getMsgObj, msgObj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getMsgObj = function (message) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!message.isReply) return [3 /*break*/, 2];
                            return [4 /*yield*/, message.getReplyMessage()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, message];
                    }
                }); }); };
                return [4 /*yield*/, getMsgObj(message)];
            case 1:
                msgObj = _a.sent();
                if (!((msgObj === null || msgObj === void 0 ? void 0 : msgObj.media) && !msgObj.sticker && msgObj.photo)) return [3 /*break*/, 3];
                return [4 /*yield*/, client.downloadMedia(msgObj.media, { workers: 1 })];
            case 2: return [2 /*return*/, _a.sent()];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLandmark = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visionClient.landmarkDetection(buffer)];
            case 1:
                result = (_a.sent())[0];
                return [2 /*return*/, result.landmarkAnnotations];
        }
    });
}); };
var getFaceAnnotations = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visionClient.faceDetection(buffer)];
            case 1:
                result = (_a.sent())[0];
                return [2 /*return*/, result.faceAnnotations];
        }
    });
}); };
var getLabelAnnotations = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visionClient.labelDetection(buffer)];
            case 1:
                result = (_a.sent())[0];
                return [2 /*return*/, result.labelAnnotations];
        }
    });
}); };
var getNSFWAnnotations = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visionClient.safeSearchDetection(buffer)];
            case 1:
                result = (_a.sent())[0];
                return [2 /*return*/, result.safeSearchAnnotation];
        }
    });
}); };
var getWeatherMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var location, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                location = message.text.replace(/.weather /i, '');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 6]);
                return [4 /*yield*/, weather.now(location)];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, message.reply({ message: "It's currently a " + result.temperatureDesc + " " + result.temperature + "\u00B0C in " + result.city + ", " + result.country + " and it's " + result.skyDescription })];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                e_1 = _a.sent();
                return [4 /*yield*/, message.reply({ message: "An error occured :(\nError: " + e_1 })];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getOCRText = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, tesseract_js_1.recognize)(buffer)];
            case 1: return [4 /*yield*/, (_a.sent()).data.text];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var client = new telegram_1.TelegramClient(new sessions_1.StringSession(stringSession), apiID, apiHash, { connectionRetries: 5 });
client.start({ botAuthToken: "" });
try {
    client.addEventHandler(eventPrint, new events_1.NewMessage({}));
}
catch (e) {
    console.log(e);
}
