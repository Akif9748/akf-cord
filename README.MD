# akf-cord
A lightweight discord API wrapper. Only requires `ws`.

Usage:
```js
const cord = require('akf-cord');

const client = new cord.Client('token');

client.on('ready', () => {
    console.log('Ready!');
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
                    url: cord.avatarURL(interaction.member.user, 128, "png")
                }
            }
        ]
    });
});

client.login();
```
