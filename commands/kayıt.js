const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "kayıt",
    description: "Gelişmiş kayıt sistemini ayarlarsın.",
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kayıt edilecek kişi.",
            type: 9,
            required: true,
        },
        {
            name: "isim",
            description: "Kayıt edilecek kişinin ismi.",
            type: 3,
            required: true,
        },
        {
            name: "yaş",
            description: "Kayıt edilecek kişinin yaşı.",
            type: 10,
            required: true,
        },
],
    run: async (client, interaction, message) => {

        const erkek = db.fetch(`kayıt-sistem_${interaction.guild.id}.erkekRol`)
        const kız = db.fetch(`kayıt-sistem_${interaction.guild.id}.kızRol`)
        const yetkili = db.fetch(`kayıt-sistem_${interaction.guild.id}.yetkiliRol`)
        const kayıtsız = db.fetch(`kayıt-sistem_${interaction.guild.id}.kayıtsızRol`)

        if(!erkek || !kız || !yetkili || !kayıtsız) return interaction.reply({ content: `Ayarları yapmanı tavsiye ederim.`})

        const yetki = new EmbedBuilder()
            .setAuthor({ name: `Yetki Yetersiz`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Bu komutu kullanabilmek için <@&${yetkili}> rolüne sahip olman gerekiyor.`)

        if (!interaction.member.roles.cache.get(yetkili)) return interaction.reply({ embeds: [yetki] })


        const kullanıcı = interaction.options.getMentionable("kullanıcı")
        const isim = interaction.options.getString("isim")
        const yaş = interaction.options.getNumber("yaş")

        if(!interaction.guild.members.cache.get(kullanıcı.id).roles.cache.get(kayıtsız)) return interaction.reply({ content: `Kullanıcı zaten kayıtlı.` })

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("♂️")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("erkek" + interaction.user.id)
        )
        .addComponents(
            new ButtonBuilder()
                .setEmoji("♀️")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kız" + interaction.user.id)
        )

        const who = new EmbedBuilder()
        .setAuthor({ name: `Cinsiyet Belirt`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Kayıt edeceğin kişinin cinsiyeti için butona tıkla.`)

        interaction.reply({ embeds: [who], components: [row] })

        db.push(`isim_${interaction.guild.id}`, {userID: kullanıcı.id, isim: isim, age: yaş})
        db.set(`kayıt-bekleme_${interaction.guild.id}`, { kullanıcı: kullanıcı.id, isim: isim, yaş: yaş, kanal: interaction.channel.id, mesaj: interaction.id})

        }
};