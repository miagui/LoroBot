"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
var jsonCron = require("./cron/jsonCron.js");
const client = new discord_js_1.default.Client();
// * Token que faz o bot funcionar. Ela é secreta e nínguem pode saber.
var token = process.env.token;
// * Adiciona uma ação para o evento ready (quando o bot for iniciado).
// * Nesse caso, ele manda no log uma mensagem de que ele está logado.
client.on("ready", () => {
    var _a;
    console.log(`Logado como ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}`);
    jsonCron.Iniciar();
});
client.on("message", msg => {
    var _a, _b;
    let prefix = "!";
    if ((_a = msg.author) === null || _a === void 0 ? void 0 : _a.bot)
        return; // Se a mensagem for do bot, então retorne nada
    if (((_b = msg.content) === null || _b === void 0 ? void 0 : _b.toString()[0]) != prefix)
        return; // Se não houver prefixo '!', então retorne nada 
    // * Pega o comando através de vários processos para filtrar apenas o nome e não argumentos.
    // * slice: Corta o primeiro prefixo; trim: Corta os espaços em branco; split: Corta os argumentos do comando
    // * usando de regex (corta por todo espaço em branco depois do comando).
    // * Também foi usado do Non-null Assertion para marcar que a msg nunca será nula (usado !).
    let command = msg.content.slice(prefix.length).trim().split(/ +/g, 1).toString();
    let args = msg.content.slice(command.length + prefix.length);
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, msg, command, args);
    }
    catch (e) {
        // * Se não encontrar o módulo, manda mensagem que não existe o comando.
        if (e.code === "MODULE_NOT_FOUND")
            msg.reply("Comando não existente.");
        console.log(e);
    }
});
client.login(token);
