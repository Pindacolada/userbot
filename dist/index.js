"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const events_1 = require("telegram/events");
const Weather = __importStar(require("weather"));
const tesseract_js_1 = require("tesseract.js");
const vision_1 = __importDefault(require("@google-cloud/vision"));
const localisation = require("../config/localisation.json");
const config = require("../config/config.json");
const visionClient = new vision_1.default.ImageAnnotatorClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = './userbotGoogleAuth.json';
const appID = config.appId;
const appCode = config.appCode;
const weather = new Weather({ appID, appCode });
const apiID = config.apiID;
const apiHash = config.apiHash;
const stringSession = config.stringSession;
async function eventPrint(event) {
    const message = event.message;
    if (message.senderId == 1194948996 || message.senderId) {
        if (message.text == '.otter') {
            return await message.reply({ message: `🦦`.repeat(Math.floor(Math.random() * 10)) });
        }
        if (message.text.match(/^\.weather \w+$/i) !== null) {
            return getWeatherMessage(message);
        }
        if (message.text == '.ocr') {
            const buffer = await getImageBuffer(message);
            if (buffer) {
                const text = await getOCRText(buffer);
                if (text) {
                    await message.reply({ message: text });
                }
                else {
                    await message.reply({ message: 'No text found :/' });
                }
            }
            else {
                await message.reply({ message: 'No image found :/' });
            }
        }
        if (message.text == '.what') {
            const buffer = await getImageBuffer(message);
            if (buffer) {
                const labelAnnotations = await getLabelAnnotations(buffer);
                if (labelAnnotations) {
                    let combinedLabels = '';
                    labelAnnotations.forEach(label => combinedLabels += label.description + '\n');
                    await message.reply({ message: combinedLabels });
                }
                else {
                    await message.reply({ message: 'No labels annotations found :/' });
                }
            }
            else {
                await message.reply({ message: 'No image found :/' });
            }
        }
        if (message.text.match(/^\.isnsfw$/i) !== null) {
            const buffer = await getImageBuffer(message);
            if (buffer) {
                const nsfwAnnotations = await getNSFWAnnotations(buffer);
                if ((nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.adult) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.medical) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.spoof) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.violence) && (nsfwAnnotations === null || nsfwAnnotations === void 0 ? void 0 : nsfwAnnotations.racy)) {
                    await message.reply({ message: `Adult: ${localisation[nsfwAnnotations.adult]}\nMedical: ${localisation[nsfwAnnotations.medical]}\nSpoof: ${localisation[nsfwAnnotations.spoof]}\nViolence: ${localisation[nsfwAnnotations.violence]}\nRacy: ${localisation[nsfwAnnotations.racy]}` });
                }
                else {
                    await message.reply({ message: 'No face annotations found :/' });
                }
            }
            else {
                await message.reply({ message: 'No image found :/' });
            }
        }
        if (message.text.match(/^\.face$/i) !== null) {
            const buffer = await getImageBuffer(message);
            if (buffer) {
                const faceAnnotations = await getFaceAnnotations(buffer);
                if ((faceAnnotations === null || faceAnnotations === void 0 ? void 0 : faceAnnotations.length) == 0)
                    return await message.reply({ message: 'No face detected :/' });
                let text = '';
                faceAnnotations === null || faceAnnotations === void 0 ? void 0 : faceAnnotations.forEach((face, i) => {
                    if (face.joyLikelihood && face.angerLikelihood && face.sorrowLikelihood && face.surpriseLikelihood) {
                        text += `Face ${i + 1}:\nJoy: ${localisation[face.joyLikelihood]}\nAnger: ${localisation[face.angerLikelihood]}\nSorrow: ${localisation[face.sorrowLikelihood]}\nSurprise: ${localisation[face.surpriseLikelihood]}\n`;
                    }
                });
                await message.reply({ message: text });
            }
            else {
                await message.reply({ message: 'No image found :/' });
            }
        }
        if (message.text.match(/^\.landmark$/i) !== null) {
            {
                const buffer = await getImageBuffer(message);
                if (buffer) {
                    const landmark = await getLandmark(buffer);
                    console.log(landmark === null || landmark === void 0 ? void 0 : landmark.length);
                    if ((landmark === null || landmark === void 0 ? void 0 : landmark.length) == 0)
                        return await message.reply({ message: 'No Landmarks detected :/' });
                    if (landmark) {
                        let text = '';
                        landmark.forEach((item, i) => {
                            if (item === null || item === void 0 ? void 0 : item.description) {
                                if (text.match(item.description) == null) {
                                    text += `${i + 1}. ${item.description}\n`;
                                }
                            }
                        });
                        await message.reply({ message: text });
                    }
                }
                else {
                    await message.reply({ message: 'No image found :/' });
                }
            }
        }
    }
}
const getImageBuffer = async (message) => {
    const getMsgObj = async (message) => { if (message.isReply) {
        return await message.getReplyMessage();
    } return message; };
    const msgObj = await getMsgObj(message);
    if ((msgObj === null || msgObj === void 0 ? void 0 : msgObj.media) && !msgObj.sticker && msgObj.photo) {
        return await client.downloadMedia(msgObj.media, { workers: 1 });
    }
};
const getLandmark = async (buffer) => {
    const [result] = await visionClient.landmarkDetection(buffer);
    return result.landmarkAnnotations;
};
const getFaceAnnotations = async (buffer) => {
    const [result] = await visionClient.faceDetection(buffer);
    return result.faceAnnotations;
};
const getLabelAnnotations = async (buffer) => {
    const [result] = await visionClient.labelDetection(buffer);
    return result.labelAnnotations;
};
const getNSFWAnnotations = async (buffer) => {
    const [result] = await visionClient.safeSearchDetection(buffer);
    return result.safeSearchAnnotation;
};
const getWeatherMessage = async (message) => {
    const location = message.text.replace(/.weather /i, '');
    try {
        const result = await weather.now(location);
        await message.reply({ message: `It's currently a ${result.temperatureDesc} ${result.temperature}°C in ${result.city}, ${result.country} and it's ${result.skyDescription}` });
    }
    catch (e) {
        await message.reply({ message: `An error occured :(\nError: ${e}` });
    }
};
const getOCRText = async (buffer) => {
    return await (await (0, tesseract_js_1.recognize)(buffer)).data.text;
};
const client = new telegram_1.TelegramClient(new sessions_1.StringSession(stringSession), apiID, apiHash, { connectionRetries: 5 });
client.start({ botAuthToken: "" });
try {
    client.addEventHandler(eventPrint, new events_1.NewMessage({}));
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTBDO0FBQzFDLGdEQUFrRDtBQUNsRCw0Q0FBNkM7QUFHN0MsaURBQW1DO0FBQ25DLCtDQUF3QztBQUN4QyxrRUFBeUM7QUFFekMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDNUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFaEQsTUFBTSxZQUFZLEdBQUcsSUFBSSxnQkFBSyxDQUFDLG9CQUFvQixFQUFFLENBQUM7QUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsR0FBRywwQkFBMEIsQ0FBQTtBQUV2RSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFFL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUU5QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDL0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUUzQyxLQUFLLFVBQVUsVUFBVSxDQUFDLEtBQXNCO0lBQzlDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFrQixDQUFDO0lBQ3pDLElBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxVQUFVLElBQUksT0FBTyxDQUFDLFFBQVEsRUFDckQ7UUFDRSxJQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUMzQjtZQUNFLE9BQU8sTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxF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