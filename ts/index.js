"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config_js_1 = __importDefault(require("./config.js"));
const util_js_1 = __importDefault(require("./util.js"));
const command_js_1 = __importDefault(require("./command.js"));
// import commands from './commands.js'
const fs_1 = __importDefault(require("fs"));
const db_js_1 = __importDefault(require("./db.js"));
const logger_js_1 = __importDefault(require("./logger.js"));
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.default.Intents.FLAGS.GUILDS,
        discord_js_1.default.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.default.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.default.Intents.FLAGS.GUILD_MESSAGES,
        // Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ],
});
let enable = true;
client.on('ready', async () => {
    if (!client)
        return;
    if (!client.user)
        return;
    logger_js_1.default.log(`Logged in as ${client.user.tag}!`);
    util_js_1.default.serverInfo(client, '689384013047005199');
    client.user.setPresence(util_js_1.default.defaultAct);
    logger_js_1.default.info('Loading commands...');
    config_js_1.default.servers.forEach(async (s) => {
        await client.guilds.fetch(s);
    });
    let files = fs_1.default.readdirSync('./commands');
    for (let file of files) {
        if (file.endsWith('.js')) {
            let cmd = await Promise.resolve().then(() => __importStar(require(`./commands/${file}`)));
            await cmd.create(client);
        }
    }
    logger_js_1.default.info('Loaded Done!');
    db_js_1.default.read();
    if (db_js_1.default.data == null)
        return;
    for (const key in db_js_1.default.data.commandLog) {
        if (db_js_1.default.data.commandLog[key]) {
            if (!command_js_1.default.all.find((c) => c.name == key)) {
                logger_js_1.default.log(logger_js_1.default.c.red('Command'), logger_js_1.default.c.blue(key), logger_js_1.default.c.red('in in the database but has no corresponding command.'));
            }
        }
    }
});
// log.log(command.commands)
client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    if (enable)
        command_js_1.default.runAllText(message, client);
    if (message.author.id == '557413703029358593') {
        // if mesage rorry
        if (!message.content.includes('mum'))
            return;
        const responses = ['rory shut ur bitch ass up', 'rory no one gives a fuck'];
        const res = responses[Math.floor(Math.random() * responses.length)];
        message.channel.send(res);
    }
});
client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        if (enable) {
            let res = command_js_1.default.runAllSlash(interaction, client);
            if (!res) {
                let embed = new discord_js_1.default.MessageEmbed();
                embed.setTitle(`Sorry, I don't know what that means. Try /help for a list of commands.`);
                embed.setColor(util_js_1.default.hslToHex(Math.random() * 360, 100, 50));
                interaction.reply({
                    embeds: [embed],
                });
            }
        }
    }
    if (interaction.isButton()) {
        logger_js_1.default.log(interaction);
    }
});
client.on('presenceUpdate', async (oldMember, newMember) => {
    // log.log('old', oldMember)
    // log.log('new', newMember)
    if (newMember.user == null)
        return;
    if (newMember.guild == null)
        return;
    if (newMember.user.bot)
        return;
    if (newMember.guild.id != '689384013047005199')
        return;
    const g = await client.guilds.fetch(newMember.guild.id);
    const m = await g.members.fetch(newMember.user.id);
    util_js_1.default.userStatuses(m);
});
client.login(config_js_1.default.kyro);
