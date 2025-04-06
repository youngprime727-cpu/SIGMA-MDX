const {getContextInfo} = require('./new')
const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({

    pattern: "menu",

    react: "📑",

    desc: "Get bot command list.",

    category: "main",

    use: '.menu',

    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
let madeMenu = `*╭═〘〘 ${config.BOT_NAME} 〙〙═╮*
┃ ⏱ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
┃ ⚙️ 𝙈𝙤𝙙𝙚 : *${config.MODE}*
┃ ❯ 𝙋𝙧𝙚𝙛𝙞𝙭 : *${config.PREFIX}*
┃ 💾 𝙍𝙖𝙢 : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃ 👑 𝘿𝙚𝙫 : MUZAN SIGMA
┃ 🧾 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : *1.0.0*
*╰═════════════════════╯*

╭──〔  ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ 〕──╮
┃ fb
┃ insta
┃ twitter
┃ tt
┃ mediafire
┃ gdrive
┃ play
┃ spotify
┃ apk
┃ video
┃ img
┃ lyrics
┃ song
╰─────────────────────╯

╭──〔  sᴇᴀʀᴄʜ ᴍᴇɴᴜ 〕──╮
┃ yts
┃ yta
┃ movie
┃ movieinfo
┃ google
┃ weather
┃ sticksearch
╰────────────────────╯

╭──〔  ᴀɪ ᴍᴇɴᴜ 〕──╮
┃ gpt
┃ ai
╰────────────╯

╭──〔  ᴏᴡɴᴇʀ ᴍᴇɴᴜ 〕──╮
┃ updatecmd
┃ settings
┃ owner
┃ system
┃ status
┃ about
┃ repo
┃ block
┃ unblock
┃ setpp
┃ jid
┃ gjid
┃ pair
┃ save
┃ eval
┃ shutdown
┃ restart
┃ broadcast
┃ clearchats
╰────────────────────╯

╭──〔 ɢʀᴏᴜᴘ ᴍᴇɴᴜ 〕──╮
┃ add
┃ remove
┃ del
┃ kick
┃ kickall
┃ promote
┃ demote
┃ tagall
┃ leave
┃ setwelcome
┃ setgoodbye
┃ mute
┃ unmute
┃ lockgc
┃ unlockgc
┃ gname
┃ gdesc
┃ ginfo
┃ revoke
┃ invite
┃ newgc
┃ join
┃ randomship
┃ joinrequests
┃ allreq
┃ getpic
┃ hidetag
╰────────────────────╯

╭──〔 ɪɴғᴏ ᴍᴇɴᴜ 〕──╮
┃ about
┃ ping
┃ ping2
┃ status
┃ system
┃ dev
┃ alive
┃ botinfo
┃ request
╰───────────────────╯

╭──〔 ʙᴏᴛ ᴍᴇɴᴜ 〕──╮
┃ menu
┃ menu2
┃ update
┃ repo
┃ version
┃ mode
┃ antibad
┃ antilink
┃ autoreact
┃ autoreply
┃ autosticker
┃ autoreadstatus
┃ autorecording
┃ autotyping
┃ alwaysonline
╰───────────────────╯

╭──〔 ᴄᴏɴᴠᴇʀᴛᴇʀ ᴍᴇɴᴜ 〕──╮
┃ sticker
┃ take
┃ tts
┃ trt
┃ fancy
┃ url
┃ age
┃ convert
┃ tiny
╰──────────────────────╯

╭──〔 ʀᴀɴᴅᴏᴍ ᴍᴇɴᴜ 〕──╮
┃ anime
┃ randomanime
┃ loli
┃ neko
┃ waifu
┃ cosplay
┃ couplepp
┃ pickupline
┃ findname
╰─────────────────────╯

╭──〔 ᴡᴀʟʟᴘᴀᴘᴇʀ ᴍᴇɴᴜ 〕──╮
┃ ss
┃ logo
┃ img
╰────────────────────╯

╭──〔 ᴏᴛʜᴇʀ ᴍᴇɴᴜ 〕──╮
┃ quote
┃ joke
┃ fact
┃ define
┃ dailyfact
┃ spam
┃ trt
┃ qr
┃ vcard
┃ github
┃ hack
┃ vv
┃ vv2
┃ gpass
┃ srepo
┃ system
┃ rank
┃ timezone
╰────────────────────╯
> *MUZAN SIGMA 𝘿𝙀𝙑* `

await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu,
   contextInfo: getContextInfo(m.sender)
, { quoted: mek });
}catch(e){
console.log(e)
reply(`${e}`)
}
})
