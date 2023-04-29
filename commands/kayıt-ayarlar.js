const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt-ayarlar",
    description: "Kayıt sisteminin ayarlarını görüntülersin.",
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setAuthor({ name: `Yetki Yetersiz`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Bu komutu kullanabilmek için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚙️")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("ayarlar_" + interaction.member.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚠️")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("sıfırla_" + interaction.member.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("sil_" + interaction.member.id)
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Başarılı`, iconURL: interaction.guild.iconURL() || interaction.user.displayAvatarURL() })
            .setDescription(`\`⚙️\` butonuna basarak ayarlarını görebilirsin\n\`⚠️\` butonuna basarak sistemi sıfırlayabilirsin.\n\`🗑️\` butonundan bu mesajı silebilirsin.`)

        return interaction.reply({ embeds: [embed], components: [row] })
    }
};
