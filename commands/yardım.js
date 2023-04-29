const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "yardım",
    description: "Yardım menüsünü açar.",
    type: 1,
    options: [],
    run: async (client, interaction) => {


        const embed = new EmbedBuilder()
        .setAuthor({ name: `Yardım Menüsü` })
        .setDescription(`\`/kayıt-ayarla\` : Kayıt rollerini ve kanallarını ayarlar.\n\`/kayıt-ayarlar\` : Kayıt ayarlarını gösterir.\n\`/kayıt\` : Bir kullanıcıyı kayıt eder.\n\`/kayıt-sıfırla\` : Kayıt sistemini sıfırlar.\n\`/kayıt-bilgi\` : Belirtilen kullanıcının kayıt datalarını gösterir.\n\`/kayıt-isimler\` : Kullanıcının kayıt olduğu önceki isimlerini gösterir.`)
        .setFooter({ text: `Rovel | Larex` })
        interaction.reply({ embeds: [embed]})
    }
};
