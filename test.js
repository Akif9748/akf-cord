const { Client, avatarURL } = require('.');

const client = new Client('token');

// eslint-disable-next-line no-unused-vars
client.on("ready", _ready => {
    console.log("Ready!", client.user.username);
});

client.on("interaction", async interaction => {
    if (!interaction.member) return;
    // if (interaction.data.name == "ping")
    interaction.reply({
        embeds: [
            {
                title: "Hello!",
                description: "This is a test embed!",
                image: {
                    url: avatarURL(interaction.member.user, 128, "png")
                }
            }
        ]
    });
});

client.login();