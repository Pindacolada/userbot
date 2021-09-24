import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage } from "telegram/events";
import { NewMessageEvent } from "telegram/events/NewMessage";
import { Message } from "telegram/tl/custom/message";
import * as Weather from "weather";
import { recognize } from "tesseract.js"
import vison from "@google-cloud/vision";

//import config from "../config/config.json";
//import localisation from "../config/localisation.json";
const localisation = require("../config/localisation.json");
const config = require("../config/config.json");

const visionClient = new vison.ImageAnnotatorClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = './userbotGoogleAuth.json'

const appID = config.appID;
const appCode = config.appCode;

const weather = new Weather({appID, appCode});

const apiID = config.apiID;
const apiHash = config.apiHash;
const stringSession = config.stringSession;

async function eventPrint(event: NewMessageEvent) {
  const message = event.message as Message;
  if(message.senderId == 1194948996 || message.senderId)
  {
    if(message.text == '.otter')
    { 
      return await message.reply({message: `🦦`.repeat(Math.floor(Math.random() * 10))});
    }
    if(message.text.match(/^\.weather \w+$/i) !== null)
    {
      return getWeatherMessage(message);
    }
    if(message.text == '.ocr')
    {
      const buffer = await getImageBuffer(message);
      if(buffer)
      {
        const text = await getOCRText(buffer);
        if(text)
        {
          await message.reply({message: text});
        } else {
          await message.reply({message: 'No text found :/'});
        }
      } else {
        await message.reply({message: 'No image found :/'});
      }
    }
    if(message.text == '.what')
    {
      const buffer = await getImageBuffer(message);
      if(buffer)
      {
        const labelAnnotations = await getLabelAnnotations(buffer);
        if(labelAnnotations)
        {
          let combinedLabels = '';
          labelAnnotations.forEach(label => combinedLabels+=label.description+'\n');
          await message.reply({message: combinedLabels});
        } else {
          await message.reply({message: 'No labels annotations found :/'});
        }
      } else {
        await message.reply({message: 'No image found :/'});
      }
    }
    if(message.text.match(/^\.isnsfw$/i) !== null)
    {
      const buffer = await getImageBuffer(message);
      if(buffer)
      {
        const nsfwAnnotations = await getNSFWAnnotations(buffer);
        if(nsfwAnnotations?.adult && nsfwAnnotations?.medical && nsfwAnnotations?.spoof && nsfwAnnotations?.violence && nsfwAnnotations?.racy)
        {
          await message.reply({message: `Adult: ${localisation[nsfwAnnotations.adult]}\nMedical: ${localisation[nsfwAnnotations.medical]}\nSpoof: ${localisation[nsfwAnnotations.spoof]}\nViolence: ${localisation[nsfwAnnotations.violence]}\nRacy: ${localisation[nsfwAnnotations.racy]}`});
        } else {
          await message.reply({message: 'No face annotations found :/'});
        }
      } else {
        await message.reply({message: 'No image found :/'})
      }
    }
    if(message.text.match(/^\.face$/i) !== null)
    {
      const buffer = await getImageBuffer(message);
      if(buffer)
      {
        const faceAnnotations = await getFaceAnnotations(buffer);
        if(faceAnnotations?.length == 0) return await message.reply({message: 'No face detected :/'});
        let text = '';
        faceAnnotations?.forEach((face, i) => {
          if(face.joyLikelihood && face.angerLikelihood && face.sorrowLikelihood && face.surpriseLikelihood)
          {
            text += `Face ${i + 1}:\nJoy: ${localisation[face.joyLikelihood]}\nAnger: ${localisation[face.angerLikelihood]}\nSorrow: ${localisation[face.sorrowLikelihood]}\nSurprise: ${localisation[face.surpriseLikelihood]}\n`;
          }
        })
        await message.reply({message: text});
      } else {
        await message.reply({message: 'No image found :/'});
      }
    }
    if(message.text.match(/^\.landmark$/i) !== null)
    {
      {
        const buffer = await getImageBuffer(message);
        if(buffer)
        {
          const landmark = await getLandmark(buffer);
          console.log(landmark?.length);
          if(landmark?.length == 0) return await message.reply({message: 'No Landmarks detected :/'});
          if(landmark)
          {
            let text = '';
            landmark.forEach((item, i) => {
              if(item?.description)
              {
                if(text.match(item.description) == null)
                {
                  text += `${i+1}. ${item.description}\n`;
                }
              }
            })
            await message.reply({message: text});
          }
        } else {
          await message.reply({message: 'No image found :/'});
        }
      }
    }
  }
}

const getImageBuffer = async(message: Message) => {
  const getMsgObj = async(message: Message) => {if(message.isReply){return await message.getReplyMessage()}return message};
  const msgObj = await getMsgObj(message);
  if(msgObj?.media && !msgObj.sticker && msgObj.photo)
  {
    return await client.downloadMedia(msgObj.media, {workers: 1});
  }
}

const getLandmark = async(buffer: Buffer) => {
  const [result] = await visionClient.landmarkDetection(buffer);
  return result.landmarkAnnotations;
}

const getFaceAnnotations = async(buffer: Buffer) => {
  const [result] = await visionClient.faceDetection(buffer);
  return result.faceAnnotations;
}

const getLabelAnnotations = async(buffer: Buffer) => {
  const [result] = await visionClient.labelDetection(buffer);
  return result.labelAnnotations;
}

const getNSFWAnnotations = async(buffer: Buffer) => {
  const [result] = await visionClient.safeSearchDetection(buffer);
  return result.safeSearchAnnotation;
}

const getWeatherMessage = async(message: Message) => {
  const location = message.text.replace(/.weather /i, '');
  try{
    const result = await weather.now(location);
    await message.reply({message: `It's currently a ${result.temperatureDesc} ${result.temperature}°C in ${result.city}, ${result.country} and it's ${result.skyDescription}`});
  } catch(e) {
    await message.reply({message: `An error occured :(\nError: ${e}`});
  }
}

const getOCRText = async(buffer: Buffer) => {
  return await (await recognize(buffer)).data.text
}

const client = new TelegramClient(
  new StringSession(stringSession),
  apiID,
  apiHash,
  { connectionRetries: 5 }
);
client.start({botAuthToken: ""});
try{
  client.addEventHandler(eventPrint, new NewMessage({}));
}catch(e) {
  console.log(e)
}