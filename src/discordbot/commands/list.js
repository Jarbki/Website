async function list(msg){
    const args = msg.content.trim().split(" ");
    const type = args[1]; // e.g., "sound", "image", "video"

    const endpointMap = {
        image: 'http://localhost:3000/api/images',
        video: 'http://localhost:3000/api/videos',
        sound: 'http://localhost:3000/api/sounds'
    };

    if (!endpointMap[type]) {
        msg.reply("Usage: `!list image`, `!list video`, or `!list sound`");
        return;
    }

    try {
        const response = await fetch(endpointMap[type]);
        if (!response.ok) {
        msg.reply(`Server error: ${response.status}`);
        return;
        }

    const fileList = await response.json(); // list of strings

    if (!fileList.length) {
      msg.reply(`No ${type}s found.`);
      return;
    }

        // Limit output to first 10 items
        const output = fileList.slice(0, 10).join('\n');

        msg.reply(`📁 Available ${type}s:\n\`\`\`\n${output}\n\`\`\``);
    } catch (err) {
        console.error(err);
        msg.reply("Failed to fetch media from the server.");
    }
}

module.exports = list;