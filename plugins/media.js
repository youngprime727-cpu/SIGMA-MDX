
const { cmd } = require('../command');
const config = require('../config');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson, empiretourl } = require('../lib/functions');
const ffmpeg = require('fluent-ffmpeg');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');
const { sms, downloadMediaMessage } = require('../lib/msg');
const axios = require('axios');
const moment = require('moment');

// Variable to keep track of whether the daily fact feature is enabled
let isFactEnabled = false;
let factTimer; // To store the interval timer for daily facts

// Define the themes for each day of the week
const dailyThemes = {
    Monday: 'amour',        // Love
    Tuesday: 'motivation',  // Motivation
    Wednesday: 'science',   // Science
    Thursday: 'blague',     // Joke
    Friday: 'conseils',     // Tips
    Saturday: 'amour',      // Love
    Sunday: 'motivation',   // Motivation
};

cmd({
    pattern: "dailyfact",
    desc: "Get a random fact of the day and control the daily fact feature.",
    react: "📚",
    category: "main",
    use: ".dailyfact on/off",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    // Check the first argument (on/off)
    if (args[0] === "on") {
        if (isFactEnabled) {
            return reply("❌ The daily fact feature is already enabled.");
        }
        
        isFactEnabled = true;
        reply("✅ The daily fact feature is now enabled. I will send a fact every day at 6 AM (Cameroon time).");

        // Set the daily fact interval at 6 AM (Cameroon time)
        sendDailyFactAt6AM(conn, reply);
    } 
    else if (args[0] === "off") {
        if (!isFactEnabled) {
            return reply("❌ The daily fact feature is already disabled.");
        }

        clearInterval(factTimer); // Clear the timer when the feature is disabled
        isFactEnabled = false;
        reply("❌ The daily fact feature is now disabled.");
    } 
    else {
        reply("❌ Please specify 'on' or 'off' to enable or disable the daily fact feature.\nExample: `.dailyfact on`");
    }
});

// Function to fetch and send the daily fact
async function sendDailyFact(conn, reply) {
    try {
        const dayOfWeek = moment().format('dddd'); // Get the current day of the week
        const theme = dailyThemes[dayOfWeek]; // Get the theme for the current day

        // Send a message saying we're fetching the daily fact
        reply(`Fetching a ${theme} fact for you...`);

        // API endpoint for random facts with the theme based on the current day
        const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=fr`);

        // Extract the fact from the API response
        const fact = response.data.text;

        // Send the fact back to the user
        reply(`📚 Here's a ${theme} fact for you on ${dayOfWeek}:\n\n*${fact}*\n\n> POWERED BY KERM*`);
        
    } catch (error) {
        console.error("Error fetching daily fact:", error.message);
        reply("❌ Sorry, I couldn't fetch a fact for today. Please try again later.");
    }
}

// Function to calculate the time until 6 AM and set the interval
function sendDailyFactAt6AM(conn, reply) {
    const now = moment();
    const targetTime = moment().set({ hour: 6, minute: 0, second: 0, millisecond: 0 }); // 6 AM Cameroon time

    if (now.isAfter(targetTime)) {
        // If it's already past 6 AM today, set the time for 6 AM tomorrow
        targetTime.add(1, 'days');
    }

    const timeUntilNextRun = targetTime.diff(now); // Time difference in milliseconds

    // Set an interval to send the daily fact at 6 AM every day
    factTimer = setInterval(() => {
        sendDailyFact(conn, reply); // Send the fact at 6 AM every day
    }, 86400000); // Repeat every 24 hours

    // Wait until the next 6 AM and send the first fact
    setTimeout(() => {
        sendDailyFact(conn, reply); // Send the first fact
    }, timeUntilNextRun);
}
cmd({
    pattern: "age",
    desc: "Calculate your age based on your date of birth.",
    react: "🎉",
    category: "main",
    use: ".age <DD/MM/YYYY>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide your date of birth in the format DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        const birthDate = args[0]; // Get the date of birth from user input
        const dateOfBirth = moment(birthDate, "DD/MM/YYYY");

        // Validate the provided date
        if (!dateOfBirth.isValid()) {
            return reply("❌ Invalid date format. Please use DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        // Calculate the age by comparing the current date with the birthdate
        const age = moment().diff(dateOfBirth, 'years');
        
        // Send the calculated age back to the user
        reply(`🎉 Your age is: *${age}* years old.`);

    } catch (error) {
        console.error("Error calculating age:", error.message);
        reply("❌ An error occurred while calculating your age. Please try again later.");
    }
});
cmd({
    pattern: "timezone",
    desc: "Get the current time in a specific timezone.",
    react: "🕰️",
    category: "main",
    use: ".timezone <timezone>",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide a timezone. Example: `.timezone Europe/Paris`");
        }

        // Get the timezone input from the user
        const timezone = args.join(" ");

        // API endpoint to get time data
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`);

        // Extract time data
        const timeData = response.data;
        const currentTime = timeData.datetime;
        const timezoneName = timeData.timezone;

        // Format the time and send it back to the user
        reply(`🕰️ The current time in ${timezoneName} is: ${currentTime}`);
        
    } catch (error) {
        console.error("Error fetching time:", error.message);
        reply("❌ Sorry, I couldn't fetch the time for the specified timezone. Please ensure the timezone is valid.");
    }
});

cmd({
    pattern: "toimage",
    react: "🤖",
    alias: ["pic", "photos"],
    desc: "Convert a sticker to an image.",
    category: "convert",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        const isQuotedSticker = m.quoted && m.quoted.type === "stickerMessage";

        if (!isQuotedSticker) {
            return reply("* ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ sᴛɪᴄᴋᴇʀ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ɪᴛ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ.*");
        }

        // Download the sticker
        const nameJpg = getRandom(".jpg");
        const stickerBuffer = await m.quoted.download();

        if (!stickerBuffer) {
            return reply("❌ Failed to download the sticker.");
        }

        // Save the file temporarily
        await require("fs").promises.writeFile(nameJpg, stickerBuffer);

        // Send the converted image
        await conn.sendMessage(m.chat, { image: { url: nameJpg }, caption: "> *he*" }, { quoted: m });

        // Delete the temporary file
        require("fs").unlinkSync(nameJpg);
    } catch (error) {
        reply("❌ An error occurred while converting.");
        console.error(error);
    }
});


cmd({
  pattern: "vv2",
    alias: ["save", "v2"],
  desc: "Save a status/photo/video and send it to your private chat (Owner only).",
  category: "owner",
  filename: __filename,
}, async (conn, mek, m, { isOwner, reply, quoted }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  try {
    if (!quoted) {
      return reply("❌ Please reply to a status, photo or video message to save it.");
    }
    
    let mime = (quoted.msg || quoted).mimetype || "";
    let mediaType = "";
    if (mime.startsWith("image")) {
      mediaType = "image";
    } else if (mime.startsWith("video")) {
      mediaType = "video";
    } else if (mime.startsWith("audio")) {
      mediaType = "audio";
    } else {
      return reply("❌ Unsupported media type. Please reply to a status, photo, or video message.");
    }
    
    const mediaBuffer = await quoted.download();
    if (!mediaBuffer) return reply("❌ Failed to download the media.");
    
    let messageOptions = {};
    if (mediaType === "image") {
      messageOptions = { image: mediaBuffer };
    } else if (mediaType === "video") {
      messageOptions = { video: mediaBuffer, mimetype: 'video/mp4' };
    } else if (mediaType === "audio") {
      messageOptions = { audio: mediaBuffer, mimetype: 'audio/mpeg' };
    }
    
    // Send the media directly to the owner's private chat (m.sender)
    await conn.sendMessage(m.sender, messageOptions);
    
  } catch (error) {
    console.error("Error in save command:", error);
    reply("❌ An error occurred while saving the media.");
  }
});
