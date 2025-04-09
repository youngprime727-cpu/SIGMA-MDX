
const config = require('../config');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { cmd } = require('../command');
const { getRandom } = require('../lib/functions');
const fs = require('fs')
//Sticker create 
var imgmsg = '';
if (config.LANG === 'SI') imgmsg = 'ඡායාරූපයකට mention දෙන්න!';
else imgmsg = 'ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴘʜᴏᴛᴏ ғᴏʀ sᴛɪᴄᴋᴇʀ!';

var descg = '';
if (config.LANG === 'SI') descg = 'එය ඔබගේ mention දුන් ඡායාරූපය ස්ටිකර් බවට පරිවර්තනය කරයි.';
else descg = 'ɪᴛ ᴄᴏɴᴠᴇʀᴛs ʏᴏᴜʀ ʀᴇᴘʟɪᴇᴅ ᴘʜᴏᴛᴏ ᴛᴏ sᴛɪᴄᴋᴇʀ.';

cmd({
    pattern: 'sticker',
    react: '🤹‍♀️',
    alias: ['s', 'stickers', 'take'],
    desc: descg,
    category: 'convert',
    use: '.sticker <Reply to image>',
    filename: __filename
}, async (conn, mek, m, { from, reply, isCmd, command, args, q, isGroup, pushname }) => {
    try {
        const isQuotedImage = m.quoted && (m.quoted.type === 'imageMessage' || (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'imageMessage'));
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';

        if ((m.type === 'imageMessage') || isQuotedImage) {
            const nameJpg = getRandom('.jpg');
            const imageBuffer = isQuotedImage ? await m.quoted.download() : await m.download();
            await require('fs').promises.writeFile(nameJpg, imageBuffer);

            let sticker = new Sticker(nameJpg, {
                pack: pushname, // The pack name
                author: '', // The author name
                type: q.includes('--crop') || q.includes('-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                categories: ['🤩', '🎉'], // The sticker category
                id: '12345', // The sticker id
                quality: 75, // The quality of the output file
                background: 'transparent', // The sticker background color (only for full stickers)
            });

            const buffer = await sticker.toBuffer();
            return conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        } else if (isQuotedSticker) {
            const nameWebp = getRandom('.webp');
            const stickerBuffer = await m.quoted.download();
            await require('fs').promises.writeFile(nameWebp, stickerBuffer);

            let sticker = new Sticker(nameWebp, {
                pack: pushname, // The pack name
                author: '', // The author name
                type: q.includes('--crop') || q.includes('-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                categories: ['🤩', '🎉'], // The sticker category
                id: '12345', // The sticker id
                quality: 75, // The quality of the output file
                background: 'transparent', // The sticker background color (only for full stickers)
            });

            const buffer = await sticker.toBuffer();
            return conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        } else {
            return await reply(imgmsg);
        }
    } catch (e) {
        reply('Error !!');
        console.error(e);
    }
});

//=================vv=====================//

cmd({
    pattern: 'vv',
    react: '👁️',
    alias: ['vv', 'viewonce'],
    desc: 'Download and send view once media (images, videos, or audios).',
    category: 'convert',
    use: '.viewonce <Reply to image/video/audio>',
    filename: __filename
}, async (conn, mek, m, { from, reply, isCmd, command, args, q, isGroup, pushname }) => {
    try {
        const isQuotedImage = m.quoted && (m.quoted.type === 'imageMessage' || (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'imageMessage'));
        const isQuotedVideo = m.quoted && (m.quoted.type === 'videoMessage' || (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'videoMessage'));
        const isQuotedAudio = m.quoted && (m.quoted.type === 'audioMessage' || (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'audioMessage'));
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';

        // If the message is an image or quoted image
        if ((m.type === 'imageMessage') || isQuotedImage) {
            const nameJpg = getRandom('.jpg');
            const imageBuffer = isQuotedImage ? await m.quoted.download() : await m.download();
            await fs.promises.writeFile(nameJpg, imageBuffer);

            // Send the image back instead of converting to sticker
            return conn.sendMessage(from, { image: { url: nameJpg }, caption: 'Here is your downloaded image.' }, { quoted: mek });
        } 
        // If the message is a sticker or quoted sticker
        else if (isQuotedSticker) {
            const nameWebp = getRandom('.webp');
            const stickerBuffer = await m.quoted.download();
            await fs.promises.writeFile(nameWebp, stickerBuffer);

            let sticker = new Sticker(nameWebp, {
                pack: pushname,
                author: '',
                type: q.includes('--crop') || q.includes('-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 75,
                background: 'transparent',
            });

            const buffer = await sticker.toBuffer();
            return conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        } 
        // If the message is a video or quoted video
        else if (isQuotedVideo) {
            const nameMp4 = getRandom('.mp4');
            const videoBuffer = await m.quoted.download();
            await fs.promises.writeFile(nameMp4, videoBuffer);

            // Send the video back to the user
            return conn.sendMessage(from, { video: { url: nameMp4 }, caption: 'Here is your downloaded video.' }, { quoted: mek });
        }
        // If the message is an audio or quoted audio
        else if (isQuotedAudio) {
            const nameAudio = getRandom('.mp4');
            const audioBuffer = await m.quoted.download();
            await fs.promises.writeFile(nameAudio, audioBuffer);

            // Send the audio back to the user
            return conn.sendMessage(from, { audio: { url: nameAudio }, mimetype: 'audio/mp4' }, { quoted: mek });
        } else {
            return await reply(imgmsg);
        }
    } catch (e) {
        reply('Error !!');
        console.error(e);
    }
});


//===================vv2=========================//


cmd({
    pattern: 'vv2',
    react: '📩',
    desc: 'Download view once media and send to DM (Owner only).',
    category: 'media',
    use: '.vv2 <Reply to view once>',
    filename: __filename
}, async (conn, mek, m, { reply, isOwner }) => {
    try {
        if (!isOwner) {
            return reply('❌ Only the bot owner can use this command.');
        }

        const isQuotedImage = m.quoted && (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'imageMessage');
        const isQuotedVideo = m.quoted && (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'videoMessage');
        const isQuotedAudio = m.quoted && (m.quoted.type === 'viewOnceMessage' && m.quoted.msg.type === 'audioMessage');

        if (isQuotedImage) {
            const fileName = getRandom('.jpg');
            const buffer = await m.quoted.download();
            await fs.promises.writeFile(fileName, buffer);
            const caption = m.quoted.caption || 'Here is your image from view once.';

            await conn.sendMessage(m.sender, { image: { url: fileName }, caption: caption }, { quoted: mek });
            return reply('✅ Sent the image to your DM.');
        }

        if (isQuotedVideo) {
            const fileName = getRandom('.mp4');
            const buffer = await m.quoted.download();
            await fs.promises.writeFile(fileName, buffer);
            const caption = m.quoted.caption || 'Here is your video from view once.';

            await conn.sendMessage(m.sender, { video: { url: fileName }, caption: caption }, { quoted: mek });
            return reply('✅ Sent the video to your DM.');
        }

        if (isQuotedAudio) {
            const fileName = getRandom('.mp4');
            const buffer = await m.quoted.download();
            await fs.promises.writeFile(fileName, buffer);
            const caption = m.quoted.caption || 'Here is your audio from view once.';

            await conn.sendMessage(m.sender, { audio: { url: fileName }, mimetype: 'audio/mp4', caption: caption }, { quoted: mek });
            return reply('✅ Sent the audio to your DM.');
        }

        return reply('❌ Please reply to a view once image, video, or audio.');
    } catch (e) {
        console.error(e);
        return reply('⚠️ An error occurred while processing your request.');
    }
});
