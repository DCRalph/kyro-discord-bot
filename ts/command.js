"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const db_js_1 = __importDefault(require("./db.js"));
const util_js_1 = __importDefault(require("./util.js"));
const logger_js_1 = __importDefault(require("./logger.js"));
const config_js_1 = __importDefault(require("./config.js"));
let all = [];
let commands = [];
let slashs = [];
class Command {
    constructor(client, aliases, description, fn, coolDown = 0, exclude = false) {
        if (typeof aliases === 'string')
            this.aliases = [aliases];
        else
            this.aliases = aliases;
        this.name = this.aliases[0];
        this.description = description;
        this.type = 'text';
        this.fn = fn;
        this.lastUsed = 0;
        this.coolDown = coolDown;
        if (!exclude)
            commands.push(this);
        if (!exclude)
            all.push(this);
        db_js_1.default.read();
        if (typeof db_js_1.default.data.commandLog[this.name] === 'undefined') {
            db_js_1.default.data.commandLog[this.name] = 0;
        }
        db_js_1.default.write();
        // log.success(`Command ${this.name} loaded. ${log.c.magenta('[Leagcy]')}`)
        logger_js_1.default.log(logger_js_1.default.c.green('Loaded Command'), logger_js_1.default.c.red('[Leagcy]'), this.name);
    }
    async run(message, client) {
        const now = Date.now();
        if (now - this.lastUsed > this.coolDown) {
            for (let i = 0; i < this.aliases.length; i++) {
                let alias = this.aliases[i];
                if (message.content.toLowerCase().startsWith(alias)) {
                    this.lastUsed = now;
                    try {
                        await this.fn(message, client);
                    }
                    catch (error) {
                        const embed = new discord_js_1.default.MessageEmbed();
                        embed.setTitle(`ERROR`);
                        embed.setColor(util_js_1.default.hslToHex(Math.random() * 360, 100, 50));
                        embed.addField('oopsie woopsie i made a fucky wucky a wittle fucko boingo! the code monkeys at our headquarters are working VEWY hard to fix this!', '\u200b');
                        embed.addField('Error', '```' + error + '```');
                        message.channel.send({
                            embeds: [embed],
                        });
                        logger_js_1.default.log(error);
                    }
                    db_js_1.default.read();
                    db_js_1.default.data.commandLog[this.name]++;
                    db_js_1.default.write();
                    // log.log(`Command ${this.name} used. ${log.c.magenta('[Leagcy]')}`)
                    logger_js_1.default.log(logger_js_1.default.c.green('Used Command'), logger_js_1.default.c.red('[Leagcy]'), this.name);
                    return;
                }
            }
        }
    }
}
class Slash {
    constructor(client, aliases, description, options, fn, coolDown = 0, exclude = false) {
        if (typeof aliases === 'string')
            this.aliases = [aliases];
        else
            this.aliases = aliases;
        this.name = this.aliases[0];
        this.description = description;
        this.type = 'slash';
        this.fn = fn;
        this.lastUsed = 0;
        this.coolDown = coolDown;
        if (!exclude)
            slashs.push(this);
        if (!exclude)
            all.push(this);
        const data = {
            name: this.name.toLowerCase(),
            description: description,
            options: options,
        };
        // client.guilds.cache.get('689384013047005199')?.commands.create(data)
        // client.guilds.cache.get('877375997870239785')?.commands.create(data)
        config_js_1.default.servers.forEach(async (s) => {
            const g = client.guilds.cache.get(s);
            // console.log(g.commands.fetch())
            g?.commands.create(data);
        });
        db_js_1.default.read();
        if (typeof db_js_1.default.data.commandLog[this.name] === 'undefined') {
            db_js_1.default.data.commandLog[this.name] = 0;
        }
        db_js_1.default.write();
        // log.success(`Command ${this.name} loaded. ${log.c.red('[Slash]')}`)
        logger_js_1.default.log(logger_js_1.default.c.green('Loaded Command'), logger_js_1.default.c.red('[Slash]'), this.name);
    }
    async run(interaction, client) {
        const now = Date.now();
        if (now - this.lastUsed > this.coolDown &&
            interaction.commandName === this.aliases[0]) {
            this.lastUsed = now;
            try {
                await this.fn(interaction, client);
            }
            catch (error) {
                const embed = new discord_js_1.default.MessageEmbed();
                embed.setTitle(`ERROR`);
                embed.setColor(util_js_1.default.hslToHex(Math.random() * 360, 100, 50));
                embed.addField('oopsie woopsie i made a fucky wucky a wittle fucko boingo! the code monkeys at our headquarters are working VEWY hard to fix this!', '\u200b');
                embed.addField('Error', '```' + error + '```');
                console.log(error);
                try {
                    await interaction.reply({
                        embeds: [embed],
                    });
                }
                catch (error) {
                    if (error.name == 'Error [INTERACTION_ALREADY_REPLIED]') {
                        try {
                            await interaction.channel.send({
                                embeds: [embed],
                            });
                        }
                        catch (error) {
                            logger_js_1.default.log(error);
                        }
                    }
                    else {
                        logger_js_1.default.log(error);
                    }
                }
                // log.log(error)
            }
            db_js_1.default.read();
            db_js_1.default.data.commandLog[this.name]++;
            db_js_1.default.write();
            logger_js_1.default.log(logger_js_1.default.c.green('Used Command'), logger_js_1.default.c.red('[Slash]'), this.name);
            return true;
        }
        return false;
    }
}
const runAllText = (message, client) => {
    commands.forEach((c) => {
        c.run(message, client);
    });
};
const runAllSlash = (interaction, client) => {
    let found = false;
    slashs.forEach((c) => {
        found = c.run(interaction, client) || found;
    });
    return found;
};
const getCommand = (cmd) => {
    for (let i = 0; i < all.length; i++) {
        if (all[i].aliases.includes(cmd)) {
            return all[i];
        }
    }
    return null;
};
exports.default = {
    Command,
    Legacy: Command,
    Slash,
    all,
    commands,
    slashs,
    // runAll,
    runAllText,
    runAllSlash,
    getCommand,
};
