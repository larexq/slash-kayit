const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt-ayarla",
    description: "Gelişmiş kayıt sistemini ayarlarsın.",
    type: 1,
    options: [
        {
            name: "erkek-rolü",
            description: "Kayıt edildikten sonraki verilecek erkek rolü.",
            type: 8,
            required: true,
        },
        {
            name: "kız-rolü",
            description: "Kayıt edildikten sonraki verilecek kız rolü.",
            type: 8,
            required: true,
        },
        {
            name: "yetkili-rolü",
            description: "Kullanıcıları kayıt edebilecek rol.",
            type: 8,
            required: true,
        },
        {
            name: "kayıtsız-rolü",
            description: "Sunucuya katılan üyelere verilecek rol.",
            type: 8,
            required: true,
        },
        {
            name: "hoşgeldin-kanal",
            description: "Hoşgeldin mesajı atılacak kanal.",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "kayıt-log",
            description: "Kayıtların log edileceği kanal.",
            type: 7,
            required: true,
            channel_types: [0]
        },
    ],
    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setAuthor({ name: `Yetki Yetersiz`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Bu komutu kullanabilmek için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const erkekRol = interaction.options.getRole('erkek-rolü')
        const kızRol = interaction.options.getRole('kız-rolü')
        const yetkiliRol = interaction.options.getRole('yetkili-rolü')
        const kayıtsızRol = interaction.options.getRole('kayıtsız-rolü')
        const hoşgeldinKanal = interaction.options.getChannel('hoşgeldin-kanal')
        const logKanal = interaction.options.getChannel('kayıt-log')


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚙️")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("ayarlar_" + interaction.member.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Sistemi Sıfırla")
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
            .setDescription("Ayarlar başarıyla ayarlandı.\n\n`⚙️` butonuna basarak yaptığın ayarları görebilirsin.")

            db.set(`kayıt-sistem_${interaction.guild.id}`, { erkekRol: erkekRol.id, kızRol: kızRol.id, yetkiliRol: yetkiliRol.id, kayıtsızRol: kayıtsızRol.id, hoşgeldinKanal: hoşgeldinKanal.id, logKanal: logKanal.id })

        return interaction.reply({ embeds: [embed], components: [row] })
    }
};
