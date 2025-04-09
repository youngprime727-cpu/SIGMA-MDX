// new.js

const getContextInfo = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363322606369079@newsletter',
        newsletterName: 'SIGMA',
        serverMessageId: 999
    }
});

module.exports = { getContextInfo };
