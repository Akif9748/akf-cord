const WebSocket = require('ws');
const fetch = global.fetch || require('node-fetch');
const { EventEmitter } = require('events');

class Client extends EventEmitter {
    constructor(token, intents = 0) {
        super();
        this.intents = intents;
        this.token = token;
    }

    async request(url, data, method = "GET") {
        const opts = {
            method,
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            }
        };
        if (data) opts.body = JSON.stringify(data);
        return await fetch(url, opts);
    }

    async login() {
        const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
        this.ws = ws;

        ws.on('open', () => ws.send(JSON.stringify({
            op: 2,
            d: {
                token: this.token,
                intents: this.intents,
                properties: {
                    $os: process.platform,
                    $browser: 'nodejs',
                    $device: 'akf-cord'
                }
            }
        })));

        ws.on('message', async data => {
            const { t, op, d, s: seqnum } = JSON.parse(data);
            if (op == 10)
                this.heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 1, d: seqnum })), d.heartbeat_interval);

            switch (t) {
                case "READY":
                    this.user = d.user;
                    this.emit("ready", d);
                    break;
                case "INTERACTION_CREATE":
                    d.reply = data => this.request(
                        `https://discord.com/api/v10/interactions/${d.id}/${d.token}/callback`, {
                        type: 4, data
                    }, "POST");
                    this.emit("interaction", d);
                    break;

            }
        });
    }

    setPresence(activity = { name: "Ready!", type: 3 }, status = "online") {
        return this.ws.send(JSON.stringify({
            op: 3,
            d: { activities: [activity], afk: false, since: null, status }
        }));
    }

    
}
module.exports = { 
    Client,
    avatarURL(user, size = 128, format = "jpg") {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=${size}`;
    }
};