const {
    Client,
    Collection,
    Discord,
    Attachment,
    ActivityType
} = require('discord.js');
const client = new Client({
    intents: 32767
});
global.EmbedBuilder = require('discord.js').EmbedBuilder;
global.fs = require('fs');
global.moment = require('moment');
global.config = require('./config.js');

if (!fs.existsSync('./cache')) {
    fs.mkdirSync('./cache');
} else {
    fs.readdirSync('./cache').forEach(file => {
        fs.unlinkSync(`./cache/${file}`);
    });
}

require("./load.js")(client);

client.on('ready', () => {
    console.log(`Bot Başarıyla Aktif Edildi! Botun Adı: ${client.user.username} | Botun ID'si: ${client.user.id}`);
    client.user.setPresence({
        activities: [{
            name: 'Abonelikler izleniyor | Operated by Sta',
            type: 0
        }],
        status: 'online'
    });
});

// Sunucu oluşturma ve proje aktivitesi sağlama.
const express = require('express');
const app = express();
const port = 3000;

// Web sunucu
app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı bağlantı noktasında yürütülüyor.`);
});

client.login(process.env.token).catch(() => console.log(`Botun Tokeni Geçersiz! Lütfen Tokeni Kontrol Ediniz!`));
