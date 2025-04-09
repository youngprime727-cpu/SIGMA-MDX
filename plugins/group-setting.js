const {getContextInfo} = require('./new')
const fs = require('fs');
const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')



//vcf//

cmd({
    pattern: 'savecontact',
    alias: ["vcf","scontact"],
    desc: 'gc vcard',
    category: 'group',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("This command is for groups only.");
        if (!isOwner) return reply("*_This command is for the owner only_*");

        let card = quoted || m; // Handle if quoted message exists
        let cmiggc = groupMetadata;
        const { participants } = groupMetadata;
        
        let orgiggc = participants.map(a => a.id);
        let vcard = '';
        let noPort = 0;
        
        for (let a of cmiggc.participants) {
            vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
        }

        let nmfilect = './contacts.vcf';
        reply('Saving ' + cmiggc.participants.length + ' participants contact');

        fs.writeFileSync(nmfilect, vcard.trim());
        await sleep(2000);

        await conn.sendMessage(from, {
            document: fs.readFileSync(nmfilect), 
            mimetype: 'text/vcard', 
            fileName: 'prince_tech.vcf', 
            caption: `\nDone saving.\nGroup Name: *${cmiggc.subject}*\nContacts: *${cmiggc.participants.length}*`,
	contextInfo: getContextInfo(m.sender)
        }, { quoted: mek });

        fs.unlinkSync(nmfilect); // Cleanup the file after sending
    } catch (err) {
        reply(err.toString());
    }
});






//kick//


cmd({
    pattern: "kick",
    alias: [".."],
    desc: "Kicks replied/quoted user from group.",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
  },           
      async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
     try {
         if (!m.isGroup) return reply(`only for groups`);
    if (!isBotAdmins) return reply(`I can't do that. give group admin`);
  
  
      const user = m.quoted.sender;
      if (!user) return reply(`*Please give me a user to kick ❗*`);
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
     reply(`${user} *has been kicked out of the group!* \n\n${yn} `);
    } catch (e) {
  reply('*Done ✓✓*')
  l(e)
  }
  })




cmd({
    pattern: "promote",
    desc: "Promote a user to group admin.",
    category: "group",
    use: '<quote|reply|number>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("This command is only for groups.");
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply("I need to be an admin to promote users.");
        
        // Check if the user running the command is an admin
        if (!isAdmins) return reply("Only group admins can promote users.");
        
        // Get the target user (quoted or number)
        let user;
        if (quoted) {
            user = quoted.sender;  // Get user from quoted message
        } else if (q) {
            user = `${q.replace(/\D/g, '')}@s.whatsapp.net`;  // Get user from the provided number
        } else {
            return reply("Please reply to a user or provide their number to promote.");
        }

        // Promote the user to admin
        await conn.groupParticipantsUpdate(from, [user], 'promote');
        reply(`✅ Successfully promoted ${user} to admin.`);
    } catch (e) {
        console.error(e);
        reply('🛑 An error occurred while promoting the user.');
    }
});

//=================================demote========================================
cmd({
    pattern: "demote",
    desc: "Demote a user from group admin.",
    category: "group",
    use: '<quote|reply|number>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("This command is only for groups.");
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply("I need to be an admin to demote users.");
        
        // Check if the user running the command is an admin
        if (!isAdmins) return reply("Only group admins can demote users.");
        
        // Get the target user (quoted or number)
        let user;
        if (quoted) {
            user = quoted.sender;  // Get user from quoted message
        } else if (q) {
            user = `${q.replace(/\D/g, '')}@s.whatsapp.net`;  // Get user from the provided number
        } else {
            return reply("Please reply to a user or provide their number to demote.");
        }

        // Demote the user from admin
        await conn.groupParticipantsUpdate(from, [user], 'demote');
        reply(`✅ Successfully demoted ${user} from admin.`);
    } catch (e) {
        console.error(e);
        reply('🛑 An error occurred while demoting the user.');
    }
});






cmd({
    pattern: "ginfo",
    desc: "Get group information.",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isOwner,
    isBotAdmins,
    reply
}) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) return reply("*`[❌]`This command can only be used in groups.*");

        // Only admins or the owner can use this command
        if (!isAdmins && !isOwner) return reply("*`[❌]`Only admins and the owner can use this command.*");

        // Ensure the bot has admin privileges
        if (!isBotAdmins) return reply("*`[❌]`I need admin privileges to execute this command.*");

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const groupName = groupMetadata.subject;
        const memberCount = groupMetadata.participants.length;

        // Get group creator
        let creator = groupMetadata.owner ? `@${groupMetadata.owner.split('@')[0]}` : 'Unknown';

        // Get list of admins
        const groupAdmins = groupMetadata.participants
            .filter(member => member.admin)
            .map((admin, index) => `${index + 1}. @${admin.id.split('@')[0]}`)
            .join("\n") || "No admins found";

        // Get creation date (convert from timestamp)
        const creationDate = groupMetadata.creation 
            ? new Date(groupMetadata.creation * 1000).toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) 
            : 'Unknown';

        // Format the output message
        const message = `
╭───「 *GROUP INFORMATION* 」───◆  
│ 🏷️ *Group Name:* ${groupName}  
│ 🆔 *Group ID:* ${from}  
│ 👥 *Total Members:* ${memberCount}  
│ 👑 *Creator:* ${creator}  
│ 📅 *Created On:* ${creationDate}  
│ 🚻 *Admins:*  
│ ${groupAdmins}  
╰──────────────────────────◆`;

        // Send the group information with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: groupMetadata.participants
                .filter(member => member.admin)
                .map(admin => admin.id)
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in ginfo command:", error);
        reply("❌ An error occurred while retrieving the group information.");
    }
});


cmd({
    pattern: "tagall",
    react: "📢",
    alias: ["gc_tagall"],
    desc: "Mention all members in the group",
    category: "group",
    use: '.tagall <message>',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("❌ Only group admins or the bot owner can use this command.");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        let message = (m.body || "").slice((prefix + command).length).trim();
        if (!message) message = "Attention everyone!";

        let teks = `╔═══════════════════╗\n`;
        teks += `║     📢 *GROUP ANNOUNCEMENT*    ║\n`;
        teks += `╠═══════════════════╣\n`;
        teks += `║ 📛 *Group:* ${groupName}\n`;
        teks += `║ 👥 *Total Members:* ${totalMembers}\n`;
        teks += `║ 💬 *Message:* ${message}\n`;
        teks += `╠═══════════════════╣\n`;
        teks += `║ 🔹 *Mentioned Members:* 🔹\n`;

        let count = 1;
        for (let mem of participants) {
            if (!mem.id) continue; 
            teks += `║ ${count++}. @${mem.id.split('@')[0]}\n`;
        }

        teks += `╚═══════════════════╝\n`;
        teks += `✅ *All members have been tagged!*`;

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});

//add//

cmd({
    pattern: "add",
    alias: ["invite"],
    desc: "Adds a user to the group.",
    category: "group",
    filename: __filename,
    use: '<number>',
},           
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!m.isGroup) return reply(`This command is only for groups.`);
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply(`I need admin privileges to add users.`);
        
        // Check if the number is provided (from q or args)
        if (!q || isNaN(q)) return reply('Please provide a valid phone number to add.');
        
        const userToAdd = `${q}@s.whatsapp.net`;  // Format the phone number

        // Add the user to the group
        await conn.groupParticipantsUpdate(m.chat, [userToAdd], "add");

        // Confirm the addition
        reply(`User ${q} has been added to the group.`);
    } catch (e) {
        console.error('Error adding user:', e);
        reply('An error occurred while adding the user. Please make sure the number is correct and they are not already in the group.');
    }
});


cmd({
    pattern: "setgcdesc",
    alias: ["upgdesc", "gdesc"],
    react: "📜",
    desc: "Change the group description.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        if (!isGroup) return reply("*📛 This command can only be used in groups.*");
        if (!isAdmins) return reply("*❌ Only group admins can use this command.*");
        if (!isBotAdmins) return reply("❌ I need to be an admin to update the group description.");
        if (!q) return reply("*❌ Please provide a new group description.*");

        await conn.groupUpdateDescription(from, q);
        reply("*✅ Group description has been updated.*");
    } catch (e) {
        console.error("Error updating group description:", e);
        reply("❌ Failed to update the group description. Please try again.");
    }
});

cmd({
    pattern: "setgcname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Change the group name.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        if (!isGroup) return reply("*📛 This command can only be used in groups.*");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("*📛 I need to be an admin to update the group name.*");
        if (!q) return reply("*⁉️ Please provide a new group name.*");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ Group name has been updated to: *${q}*`);
    } catch (e) {
        console.error("Error updating group name:", e);
        reply("❌ Failed to update the group name. Please try again.");
    }
});

//delete//

cmd({
    pattern: "delete",
    react: "⛔",
    alias: [","],
    desc: "delete message",
    category: "group",
    use: '.del',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try{
    const key = {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.quoted.id,
                    participant: m.quoted.sender
                }
                await conn.sendMessage(m.chat, { delete: key })
} catch (e) {
reply('*Error !!*')
l(e)
}
})



cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {

        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }
        

        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            return reply("*📛 Only the bot owner can use this command.*");
        }

        reply("*Leaving group...*");
        await sleep(1500);
        await conn.groupLeave(from);
        reply("*Goodbye! 👋*");
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});

cmd({
    pattern: "lockgc",
    alias: ["lock"],
    react: "🔒",
    desc: "Lock the group (Prevents new members from joining).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("*📛 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*📛 I need to be an admin to lock the group.*");

        await conn.groupSettingUpdate(from, "locked");
        reply("*✅ Group has been locked. New members cannot join.*");
    } catch (e) {
        console.error("Error locking group:", e);
        reply("❌ Failed to lock the group. Please try again.");
    }
});

cmd({
    pattern: "mute",
    alias: ["groupmute"],
    react: "🔇",
    desc: "Mute the group (Only admins can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("*📛 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*📛 I need to be an admin to mute the group.*");

        await conn.groupSettingUpdate(from, "announcement");
        reply("*_✅ Group has been muted. Only admins can send messages._*");
    } catch (e) {
        console.error("Error muting group:", e);
        reply("❌ Failed to mute the group. Please try again.");
    }
});

cmd({
    pattern: "unmute",
    alias: ["groupunmute"],
    react: "🔊",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("*📛 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("❌ I need to be an admin to unmute the group.");

        await conn.groupSettingUpdate(from, "not_announcement");
        reply("*_✅ Group has been unmuted. Everyone can send messages._*");
    } catch (e) {
        console.error("Error unmuting group:", e);
        reply("❌ Failed to unmute the group. Please try again.");
    }
});

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("*📛 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*📛 I need to be an admin to unlock the group.*");

        await conn.groupSettingUpdate(from, "unlocked");
        reply("✅ Group has been unlocked. New members can now join.");
    } catch (e) {
        console.error("Error unlocking group:", e);
        reply("❌ Failed to unlock the group. Please try again.");
    }
});

cmd({
    pattern: "tag",
    react: "🔊",
    desc: "To tag all members with a message",
    category: "group",
    use: '.tag Hi',
    filename: __filename
}, async (conn, mek, m, { from, senderNumber, participants, q, reply }) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("*📛 Only the bot owner can use this command.*");
        }

        if (!q) return reply('*Please provide a message to send.* ℹ️');

        conn.sendMessage(from, { text: q, mentions: participants.map(a => a.id), linkPreview: true }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Error Occurred !!*\n\n${e}`);
    }
});
			       
cmd({
    pattern: "demoteall",
    desc: "Demote all group admins except the bot and the command user (Owner Only)",
    category: "group",
    isOwner: true, // Only the owner can use this command
    use: ".demoteall"
  }, async (conn, mek, m, { from, reply }) => {
    try {
      // Ensure the command is used in a group
      if (!m.isGroup) return reply("❌ This command can only be used in groups.");
  
      // Get the group metadata
      const groupData = await conn.groupMetadata(from);
  
      // Filter all admins and exclude both the bot and the command sender
      const admins = groupData.participants
        .filter(p => p.admin !== null) // Select only admins
        .map(p => p.id)
        .filter(id => id !== conn.user.jid && id !== m.sender); // Exclude the bot and the command user
  
      if (admins.length === 0) {
        return reply("✅ No admins to demote.");
      }
  
      // Demote all filtered admins
      await conn.groupParticipantsUpdate(from, admins, "demote");
  
      return reply("✅ All group admins have been demoted except the bot and you.");
    } catch (error) {
      console.error("Error in demoteall command:", error);
      return reply(`❌ An error occurred: ${error.message}`);
    }
  });

