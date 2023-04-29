const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt-isimler",
    description: "Kullanıcının önceki kayıt olduğu isimler.",
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kayıt bilgileri alınacak kişi.",
            type: 9,
            required: true,
        },
    ],
    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setAuthor({ name: `Yetki Yetersiz`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Bu komutu kullanabilmek için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const kullanıcı = interaction.options.getMentionable('kullanıcı')

        let data = db.get(`isim_${interaction.guild.id}`)

        var sayi = 1

const notdata = new EmbedBuilder()
    .setThumbnail(`${kullanıcı.displayAvatarURL({ dynamic: true})}`)
    .setDescription(`${kullanıcı} Adlı Kullanıcı Daha Önce Kayıt Olmamış.`)

if(!data) return interaction.reply({ embeds: [notdata] })
let isimler = data.filter(x => x.userID === kullanıcı.id).map(x => `${sayi++} - \`• ${x.isim} | ${x.age}\``).join("\n") || `Bu Kullanıcı Kayıt Olmamış.`

const embed = new EmbedBuilder()

    .setThumbnail(`${kullanıcı.displayAvatarURL({ dynamic: true})}`)
    .setTitle(`Bu Kullanıcı ${sayi-1} Kere Kayıt Olmuş`) 
    .setDescription(`
    ${isimler}`)

    interaction.reply({ embeds: [embed]})
    }
};
