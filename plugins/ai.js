const { cmd } = require('../command');
const axios = require('axios');


//============================================ai==============================================//

cmd({
    pattern: 'ai',
    react: '🤖',
    alias: ['chatgpt', 'ask'],
    desc: 'Chat with AI',
    category: 'ai',
    use: '.ai <text>',
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        const text = args.join(' ');
        if (!text) return reply("Enter the text!");

        let prompt = "Your Name Is ELITEPRO"; // AI context prompt
        let { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
            params: {
                q: text,
                logic: prompt
            }
        });

        reply(data.result);
    } catch (e) {
        reply("Error: " + e.message);
        console.log(e);
    }
});

//============================================imgsearch=================================//


