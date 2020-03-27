import { Client, Message } from "discord.js";
import fs from 'fs';

// * Pega a pasta raiz de onde foi iniciado o .js. É util para evitar problemas de pastas relativas.
const ROOT = require('path').dirname(require.main?.filename);

// * Exporta a função 'run'.
export function run(client: Client, msg: Message, cmd: string, args: string)
{
    // * Cria a string de comandos existentes para ser concatenado depois.
    var comandosExistentes: string = "Comandos existentes: \n"
    var path: string = ROOT + "/commands";

    fs.readdir(path, (err, files) => {
    if (err) throw console.log(err);
    files.forEach(file => {
        let cmdReference = require(`${path}/${file}`)
        let cmdHelpMsg = `${cmdReference.Usage} - ${cmdReference.Info}`
        
        // * Divide o nome do arquivo do comando para sobrar apenas o nome do comando.
        // * Exemplo: 'comando.js' => 'comando'.
         var cmdName = file.split(".", 1).toString();
         // * Formata o comando para ficar mostrar o nome
         // * e as informações adicionais do comando.
        comandosExistentes += `${cmdName}: ${cmdHelpMsg}\n`;
    });

    // * Deixa a mensagem que o bot for enviar personalizada com um bloco preto no fundo
    // * usando do ``` 'mensagem' ```.
    comandosExistentes = `\`\`\`${comandosExistentes}\`\`\``

    msg.channel.send(comandosExistentes);
    })
}

export var Usage = "!help"
export var Info = "Retorna os comandos existentes do Bot."