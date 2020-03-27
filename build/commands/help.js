"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// * Pega a pasta raiz de onde foi iniciado o .js. É util para evitar problemas de pastas relativas.
const ROOT = require('path').dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
// * Exporta a função 'run'.
function run(client, msg, cmd, args) {
    // * Cria a string de comandos existentes para ser concatenado depois.
    var comandosExistentes = "Comandos existentes: \n";
    var path = ROOT + "/commands";
    fs_1.default.readdir(path, (err, files) => {
        if (err)
            throw console.log(err);
        files.forEach(file => {
            let cmdReference = require(`${path}/${file}`);
            let cmdHelpMsg = `${cmdReference.Usage} - ${cmdReference.Info}`;
            // * Divide o nome do arquivo do comando para sobrar apenas o nome do comando.
            // * Exemplo: 'comando.js' => 'comando'.
            var cmdName = file.split(".", 1).toString();
            // * Formata o comando para ficar mostrar o nome
            // * e as informações adicionais do comando.
            comandosExistentes += `${cmdName}: ${cmdHelpMsg}\n`;
        });
        // * Deixa a mensagem que o bot for enviar personalizada com um bloco preto no fundo
        // * usando do ``` 'mensagem' ```.
        comandosExistentes = `\`\`\`${comandosExistentes}\`\`\``;
        msg.channel.send(comandosExistentes);
    });
}
exports.run = run;
exports.Usage = "!help";
exports.Info = "Retorna os comandos existentes do Bot.";
