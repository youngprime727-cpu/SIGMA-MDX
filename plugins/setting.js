

const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "settings",
    react: "🎛️",
    alias: ["setting", "env"],
    desc: "Get bot's settings list.",
    category: "main",
    use: '.settings',
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    args,
    q,
    isGroup,
    sender,
    senderNumber,
    botNumber2,
    botNumber,
    pushname,
    isMe,
    isOwner,
    groupMetadata,
    groupName,
    participants,
    groupAdmins,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    try {
        // Function to return ✅ or ❌ based on the boolean value, considering multiple formats
        const statusIcon = (status) => {
            return (status === true || status === 'true' || status === 1) ? "✅" : "❌";
        };

        // Create the settings message with the updated format
        
let madeSetting = `
┌────[ ${config.BOT_NAME}]───┐
│ ᴀᴜᴛᴏʀᴇᴀᴅꜱᴛᴀᴛᴜꜱ   : ${statusIcon(config.AUTO_READ_STATUS)}
│ ᴍᴏᴅᴇ  : ${config.MODE}
│ ᴀᴜᴛᴏᴠɪᴏᴄᴇ  : ${statusIcon(config.AUTO_VOICE)}
│ ᴀᴜᴛᴏꜱᴛɪᴄᴋᴇʀ : ${statusIcon(config.AUTO_STICKER)}
│ ᴀᴜᴛᴏʀᴇᴘʟʏ : ${statusIcon(config.AUTO_REPLY)}
│ ᴀɴᴛɪʟɪɴᴋ  : ${statusIcon(config.ANTI_LINK)}
│ ᴀɴᴛɪʙᴀᴅ : ${statusIcon(config.ANTI_BAD)}
│ Prefix : [ ${config.PREFIX} ]
│ ꜰᴀᴋᴇ ʀᴇᴄᴏʀᴅɪɴɢ: ${statusIcon(config.FAKE_RECORDING)}
│ ᴀᴜᴛᴏʀᴇᴀᴄᴛ : ${statusIcon(config.AUTO_REACT)}
│ Heart React : ${statusIcon(config.HEART_REACT)}
│ OwnerReact  : ${statusIcon(config.OWNER_REACT)}

└────────────────┘
`;

        // Send the settings message with the updated format
        await conn.sendMessage(from, {
            text:madeSetting},
     { quoted: mek });
      

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
