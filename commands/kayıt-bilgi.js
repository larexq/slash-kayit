const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt-bilgi",
    description: "Kayıt sayıları hakkında bilgi alırsın.",
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

        const toplamdata = db.fetch(`kayıt-data-toplam_${interaction.user.id}`)
        const erkekdata = db.fetch(`kayıt-data-erkek_${interaction.user.id}`)
        const kızdata = db.fetch(`kayıt-data-kız_${interaction.user.id}`)

        if(!toplamdata && !erkekdata && !kızdata) return interaction.reply({ content: `Bu kullanıcının hiçbir kayıtı yok.`})

        const embed = new EmbedBuilder()
        .setAuthor({ name: `Kayıt Bilgileri`, iconURL: kullanıcı.displayAvatarURL() })
        .setDescription(`Toplam Kayıt Sayısı: \`${toplamdata || 0}\`\nToplam Erkek Kayıt Sayısı: \`${erkekdata || 0}\`\nToplam Kız Kayıt Sayısı: \`${kızdata || 0}\``)
        .setFooter({ text: `${kullanıcı.user.username}${kullanıcı.user.discriminator}`, iconURL: kullanıcı.displayAvatarURL() })
        interaction.reply({ embeds: [embed]})
        }
};
