const axios = require("axios");
const Tesseract = require('tesseract.js');
module.exports = {
    name: "rol",
    usage: "/rol <resim>",
    category: "Bot",
    options: [
        {
            name: "image",
            description: "Abone olduğunuza dair bir resim yükleyin! (PNG formatında olmalıdır!)",
            type: 11,
            contentType: "image/png",
            required: true,
        }
    ],
    admin: false,
    description: "Abone rolü verir. Abone olduğunuz halde rol vermiyorsa %90 uzaklaştırıp SS alın ve tekrar deneyin.",
    run: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.editReply({
            embeds: [{
                description: "Resim İşleniyor...",
                footer: {
                    text: "Sta Abone Rolü Kontrolcüsü",
                    iconURL: "https://i.imgur.com/rnceeW4.png"
                },
                color: 0xF2C758
            }]
        });
        let image = interaction.options.getAttachment("image");
        if (image.contentType !== "image/png") return interaction.editReply({
            embeds: [{
                description: "Lütfen PNG formatında bir resim yükleyin!",
                footer: {
                    text: "Sta Abone Rolü Kontrolcüsü",
                    iconURL: "https://i.imgur.com/rnceeW4.png"
                },
                color: 0xEB2F49
            }],
            ephemeral: true
        });
        if (image.size > 1024 * 1024 * 5) return interaction.editReply({
            embeds: [{
                description: "Lütfen 5MB'dan küçük bir resim yükleyin!",
                footer: {
                    text: "Sta Abone Rolü Kontrolcüsü",
                    iconURL: "https://i.imgur.com/rnceeW4.png"
                },
                color: 0xEB2F49
            }],
            ephemeral: true
        });
        let id = `img_${Math.floor(Math.random() * 1000000)}`;
        let res = await axios.get(image.url, {
            responseType: "arraybuffer"
        });
        fs.writeFileSync(`./cache/${id}.png`, Buffer.from(res.data, "utf-8"));

        const userName = interaction.user.username;
        Tesseract.recognize(`./cache/${id}.png`)
            .then(({
                data: {
                    text
                }
            }) => {
                fs.unlinkSync(`./cache/${id}.png`);
                if (!text.toLowerCase().includes(process.env.channelName.toLowerCase())) return interaction.editReply({
                    embeds: [{
                        description: "Resimdeki kanal doğru kanal değil!",
                        footer: {
                            text: "Sta Abone Rolü Kontrolcüsü",
                            iconURL: "https://i.imgur.com/rnceeW4.png"
                        },
                        color: 0xEB2F49
                    }]
                });
                if (!text.toLowerCase().includes(userName.toLowerCase())) return interaction.editReply({
                    embeds: [{
                        description: "Kullanıcı adınız görselde yer almıyor!",
                        footer: {
                            text: "Sta Abone Rolü Kontrolcüsü",
                            iconURL: "https://i.imgur.com/rnceeW4.png"
                        },
                        color: 0xEB2F49
                    }]
                });
                if (
                    !text.toLowerCase().includes("abone olundu") && 
                    !text.toLowerCase().includes("Abone olundu") && 
                    !text.toLowerCase().includes("abone olun...") && 
                    !text.toLowerCase().includes("abone olun") && 
                    !text.toLowerCase().includes("Abonniert") && 
                    !text.toLowerCase().includes("subscribed") && 
                    !text.toLowerCase().includes("abunə oldu") && 
                    !text.toLowerCase().includes("gezeichnet") && 
                    !text.toLowerCase().includes("abonné")
                ) {
                    return interaction.editReply({
                        embeds: [{
                            description: "## **Abone değilsin!**\n-# Abone olundu yazısının net olarak göründüğünden emin olun.\n\n-# Yüklediğiniz görsel doğrulanmıyorsa lütfen görseli direkt olarak bu kanala yükleyerek bir yetkilinin aboneliğinizi doğrulamasını bekleyin.",
                            footer: {
                                text: "Sta Abone Rolü Kontrolcüsü",
                                iconURL: "https://i.imgur.com/rnceeW4.png"
                            },
                            color: 0xEB2F49
                        }]
                    });
                }
                if (!text.toLowerCase().includes("video")) return interaction.editReply({
                    embeds: [{
                        description: "Bir şeyler ters gitti! Lütfen tekrar deneyin ya da doğrulama için bir yetkiliyi bekleyin.",
                        footer: {
                            text: "Sta Abone Rolü Kontrolcüsü",
                            iconURL: "https://i.imgur.com/rnceeW4.png"
                        },
                        color: 0xEB2F49
                    }]
                });
                let role = interaction.guild.roles.cache.get(process.env.subscriberRole);
                if (!role) return interaction.editReply({
                    embeds: [{
                        description: "Abone rolü bulunamadı!",
                        footer: {
                            text: "Sta Abone Rolü Kontrolcüsü",
                            iconURL: "https://i.imgur.com/rnceeW4.png"
                        },
                        color: 0xEB2F49
                    }]
                });
                interaction.member.roles.add(role).then(() => {
                    interaction.editReply({
                        embeds: [{
                            description: "Abone rolü başarıyla verildi!",
                            footer: {
                                text: "Sta Abone Rolü Kontrolcüsü",
                                iconURL: "https://i.imgur.com/rnceeW4.png"
                            },
                            color: 0x57F287
                        }]
                    });
                }).catch((err) => {
                    console.log(err);
                    interaction.editReply({
                        embeds: [{
                            description: "Rol verilirken bir şeyler ters gitti!",
                            footer: {
                                text: "Sta Abone Rolü Kontrolcüsü",
                                iconURL: "https://i.imgur.com/rnceeW4.png"
                            },
                            color: 0xEB2F49
                        }]
                    });
                });
            }).catch((err) => {
                console.log(err);
                interaction.followUp({
                    embeds: [{
                        description: "Bir şeyler ters gitti!",
                        footer: {
                            text: "Sta Abone Rolü Kontrolcüsü",
                            iconURL: "https://i.imgur.com/rnceeW4.png"
                        },
                        color: 0xEB2F49
                    }]
                });
            });
    },
};
