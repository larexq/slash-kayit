const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("croxydb")

module.exports = {
    name: "ping",
    description: "Botun pingini atar.",
    type: 1,
    options: [],
    run: async (client, interaction) => {

        interaction.reply({ content: `${client.ws.ping} ms.`})
    }
};
