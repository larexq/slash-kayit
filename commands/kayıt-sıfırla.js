const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt-sıfırla",
    description: "Kayıt sistemini sıfırlarsın.",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setAuthor({ name: `Yetki Yetersiz`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Bu komutu kullanabilmek için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const data = db.get(`kayıt-sistem_${interaction.guild.id}`)

        const notdata = new EmbedBuilder()
            .setAuthor({ name: `Hata`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription("Kayıt sistemi ya ayarlanmamış ya da zaten sıfırlanmış.")

        if (!data) return interaction.reply({ embeds: [notdata], ephemeral: true })

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Başarılı`, iconURL: interaction.guild.iconURL() })
            .setDescription("Kayıt sistemi başarıyla sıfırlandı.")

        db.delete(`kayıt-sistem_${interaction.guild.id}`)

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
};
