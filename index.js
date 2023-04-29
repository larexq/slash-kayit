const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs")

const client = new Client({
    intents: Object.values(Discord.IntentsBitField.Flags),
    partials: Object.values(Partials)
});

const PARTIALS = Object.values(Partials);
const db = require("croxydb");
const config = require("./config.json");
const chalk = require("chalk");

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs");
const interactionCreate = require("./events/interactionCreate");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(chalk.red`[COMMAND]` + ` ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(chalk.blue`[EVENT]` + ` ${name} eventi yüklendi.`)
});

client.login(config.token)

client.on("interactionCreate", async interaction => {

    if (interaction.customId === "erkek" + interaction.user.id) {

        const man = db.fetch(`kayıt-sistem_${interaction.guild.id}.erkekRol`)
        const unregister = db.fetch(`kayıt-sistem_${interaction.guild.id}.kayıtsızRol`)
        const yetkili = db.fetch(`kayıt-sistem_${interaction.guild.id}.yetkiliRol`)
        const log = db.fetch(`kayıt-sistem_${interaction.guild.id}.logKanal`)
        const user = db.fetch(`kayıt-bekleme_${interaction.guild.id}.kullanıcı`)
        const name = db.fetch(`kayıt-bekleme_${interaction.guild.id}.isim`)
        const age = db.fetch(`kayıt-bekleme_${interaction.guild.id}.yaş`)
        const kanal = db.fetch(`kayıt-bekleme_${interaction.guild.id}.kanal`)
  
        if(!user || !name || !age || !kanal || !yetkili || !log) {
         interaction.reply({ content: `Kullanıcının bilgileri alınamadı.`, ephemeral: true })
         db.delete(`isim_${interaction.guild.id}`)
        }

        if (!interaction.member.roles.cache.has(yetkili)) {
             interaction.reply({ content: `Bu butonu sen kullanamazsın?` })
             db.delete(`isim_${interaction.guild.id}`)
        }

        if(!interaction.guild.members.cache.get(user).roles.cache.get(unregister)) {
             interaction.reply({ content: `Kullanıcı zaten kayıtlı.`})
             db.delete(`isim_${interaction.guild.id}`)
        }

        interaction.guild.members.cache.get(user).roles.add(man)
        interaction.guild.members.cache.get(user).roles.remove(unregister)
        interaction.guild.members.cache.get(user).setNickname(`${name} | ${age}`)

        const kullanıcı = interaction.guild.members.cache.get(user) 
        
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Kayıt Başarılı`, iconURL: kullanıcı.displayAvatarURL() })
        .setDescription(`<@${user}> kullanıcısının kayıtı başarıyla tamamlandı.\n\nKullanıcıya <@&${man}> rolü verilip <@&${unregister}> rolü alındı.\nİsmi \`${name} | ${age}\` olarak değiştirildi.`)
        .setFooter({ text: `Erkek kayıtı gerçekleşti.`, iconURL: "https://cdn.discordapp.com/attachments/1068819796608684052/1101809233688793119/XPCMiWXPh0cAAAAASUVORK5CYII.png"})
        
        db.add(`kayıt-data-toplam_${interaction.user.id}`, 1)
        db.add(`kayıt-data-erkek_${interaction.user.id}`, 1)
        db.delete(`kayıt-bekleme_${interaction.guild.id}`)

        const logembed = new EmbedBuilder()
        .setDescription(`Kayıt Edilen: <@${user}>\nKayıt Eden: <@${interaction.user.id}>\nKayıt Türü: \`Erkek\``)
        
        client.channels.cache.get(log).send({ embeds: [logembed]})

        return interaction.update({ embeds: [embed], components: []})
    }
})

client.on("interactionCreate", async interaction => {

    if (interaction.customId === "kız" + interaction.user.id) {

        const woman = db.fetch(`kayıt-sistem_${interaction.guild.id}.kızRol`)
        const unregister = db.fetch(`kayıt-sistem_${interaction.guild.id}.kayıtsızRol`)
        const yetkili = db.fetch(`kayıt-sistem_${interaction.guild.id}.yetkiliRol`)
        const log = db.fetch(`kayıt-sistem_${interaction.guild.id}.logKanal`)
        const user = db.fetch(`kayıt-bekleme_${interaction.guild.id}.kullanıcı`)
        const name = db.fetch(`kayıt-bekleme_${interaction.guild.id}.isim`)
        const age = db.fetch(`kayıt-bekleme_${interaction.guild.id}.yaş`)
        const kanal = db.fetch(`kayıt-bekleme_${interaction.guild.id}.kanal`)

        if(!user || !name || !age || !kanal || !log || !yetkili) {
         interaction.reply({ content: `Kullanıcının bilgileri alınamadı.`, ephemeral: true })
         db.delete(`isim_${interaction.guild.id}`)
        }

        if (!interaction.member.roles.cache.has(yetkili)) {
             interaction.reply({ content: `Bu butonu sen kullanamazsın?` })
             db.delete(`isim_${interaction.guild.id}`)
        }

        if(!interaction.guild.members.cache.get(user).roles.cache.get(unregister)) {
             interaction.reply({ content: `Kullanıcı zaten kayıtlı.`})
             db.delete(`isim_${interaction.guild.id}`)
        }

        interaction.guild.members.cache.get(user).roles.add(woman)
        interaction.guild.members.cache.get(user).roles.remove(unregister)
        interaction.guild.members.cache.get(user).setNickname(`${name} | ${age}`)

        const kullanıcı = interaction.guild.members.cache.get(user) 
        
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Kayıt Başarılı`, iconURL: kullanıcı.displayAvatarURL() })
        .setDescription(`<@${user}> kullanıcısının kayıtı başarıyla tamamlandı.\n\nKullanıcıya <@&${woman}> rolü verilip <@&${unregister}> rolü alındı.\nİsmi \`${name} | ${age}\` olarak değiştirildi.`)
        .setFooter({ text: `Kız kayıtı gerçekleşti.`, iconURL: "https://media.discordapp.net/attachments/1068819796608684052/1101809164222746698/AAAAAElFTkSuQmCC.png"})
       
        db.add(`kayıt-data-toplam_${interaction.user.id}`, 1)
        db.add(`kayıt-data-kız_${interaction.user.id}`, 1)
        db.delete(`kayıt-bekleme_${interaction.guild.id}`)

        const logembed = new EmbedBuilder()
        .setDescription(`Kayıt Edilen: <@${user}>\nKayıt Eden: <@${interaction.user.id}>\nKayıt Türü: \`Erkek\``)
        
        client.channels.cache.get(log).send({ embeds: [logembed]})
        return interaction.update({ embeds: [embed], components: []})
    }
})

client.on('interactionCreate', async message => {
    if (message.customId === "sil_" + message.user.id) {
        await message.deferUpdate()
        message.message.delete().catch(e => { })
    }
})


client.on('interactionCreate', async (interaction) => {

    if (interaction.customId === "sıfırla_" + interaction.user.id) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.deferUpdate()

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Başarılı`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription("Kayıt sistemi başarıyla sıfırlandı.")
            .setFooter({ text: "Sistemi ayarlamak için /kayıt-ayarla komudunu kullanabilirsin." })

        db.delete(`kayıt-sistem_${interaction.guild.id}`)

        return interaction.update({ embeds: [embed] })
    }
})

client.on('interactionCreate', async (interaction) => {

    if (interaction.customId === "ayarlar_" + interaction.user.id) {

        const data = db.get(`kayıt-sistem_${interaction.guild.id}`)
        const erkekRol = db.fetch(`kayıt-sistem_${interaction.guild.id}.erkekRol`)
        const kızRol = db.fetch(`kayıt-sistem_${interaction.guild.id}.kızRol`)
        const yetkiliRol = db.fetch(`kayıt-sistem_${interaction.guild.id}.yetkiliRol`)
        const kayıtsızRol = db.fetch(`kayıt-sistem_${interaction.guild.id}.kayıtsızRol`)
        const hoşgeldinKanal = db.fetch(`kayıt-sistem_${interaction.guild.id}.hoşgeldinKanal`)
        const logKanal = db.fetch(`kayıt-sistem_${interaction.guild.id}.logKanal`)

        const embed = new EmbedBuilder()
        .setAuthor({ name: `Hata`})
        .setDescription(`Daha ayarlamama yapmamışsın.\n/kayıt-ayarla komuduyla ayarlarını yapabilirsin.`)
        if(!data) return interaction.update({ embeds: [embed]})

        const embed2 = new EmbedBuilder()
        .setAuthor({ name: `Kayıt Ayarları`, iconURL: interaction.guild.iconURL() || null })
        .setDescription(`Erkek Rolü: <@&${erkekRol || "Ayarlanmamış."}>
        Kız Rolü: <@&${kızRol || "Ayarlanmamış."}>
        Yetkili Rolü: <@&${yetkiliRol || "Ayarlanmamış."}>
        Kayıtsız Rolü: <@&${kayıtsızRol || "Ayarlanmamış."}>
        Hoşgeldin Kanalı: <#${hoşgeldinKanal || "Ayarlanmamış."}>
        Log Kanalı: <#${logKanal || "Ayarlanmamış."}>`)
        .setFooter({ text: `Ayarlarını /kayıt-ayarla komudundan değiştirebilirsin.`})
        if(data) return interaction.update({ embeds: [embed2]})
        
    }
})

client.on("guildMemberAdd", async member => {
    const moment = require('moment')
    let kayıtsız = db.fetch(`kayıt-sistem_${member.guild.id}.kayıtsızRol`)
    let yetkili = db.fetch(`kayıt-sistem_${member.guild.id}.yetkiliRol`)
    let kanal = db.fetch(`kayıt-sistem_${member.guild.id}.hoşgeldinKanal`)

    if(!kayıtsız || !kanal || !yetkili) return;
    
     let endAt = member.user.createdAt
     let gün = moment(new Date(endAt).toISOString()).format('DD')
     let ay = moment(new Date(endAt).toISOString()).format('MM').replace("01", "Ocak").replace("02","Şubat").replace("03","Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10","Ekim").replace("11","Kasım").replace("12","Aralık")
     let yıl =  moment(new Date(endAt).toISOString()).format('YYYY')
     let saat = moment(new Date(endAt).toISOString()).format('HH:mm')
     let kuruluş = `${gün} ${ay} ${yıl} ${saat}`

     member.guild.members.cache.get(member.id).roles.add(kayıtsız)
     
     const hgg = new Discord.EmbedBuilder()
     .setTitle(`Hoşgeldin!`)
     .setDescription(`Sunucuya Hoşgeldin! ${member}\n\nSeninle Birlikte \`${member.guild.memberCount}\` Kişiyiz.\n\nKayıt Kanalına İsim ve Yaşını Yazarak Kayıt Olabilirsin.\n\n<@&${yetkili}> Seninle İlgileneceklerdir.\n\nHesabın \`${kuruluş}\` Tarihinde Kurulmuştur.\n\nSunucumuzda İyi Vakit Geçir.`)
     .setFooter({ text: `Rovel`})
     client.channels.cache.get(kanal).send({embeds: [hgg]})
  })
  
