import Discord from 'discord.js';
import fs  from 'fs';
var jsonCron = require("./cron/jsonCron.js")
const client  = new Discord.Client();

// * Token que faz o bot funcionar. Ela é secreta e nínguem pode saber.
var token: string | undefined = process.env.token;

// * Adiciona uma ação para o evento ready (quando o bot for iniciado).
// * Nesse caso, ele manda no log uma mensagem de que ele está logado.
client.on("ready", () => 
{
    console.log(`Logado como ${client.user?.username}`)
    jsonCron.Iniciar();
})

client.on("message", msg => 
{
    let prefix: string = "!";
    if (msg.author?.bot) return; // Se a mensagem for do bot, então retorne nada
    if (msg.content?.toString()[0] != prefix) return; // Se não houver prefixo '!', então retorne nada 

    // * Pega o comando através de vários processos para filtrar apenas o nome e não argumentos.
    // * slice: Corta o primeiro prefixo; trim: Corta os espaços em branco; split: Corta os argumentos do comando
    // * usando de regex (corta por todo espaço em branco depois do comando).
    // * Também foi usado do Non-null Assertion para marcar que a msg nunca será nula (usado !).
    let command: string = msg.content!.slice(prefix.length).trim().split(/ +/g, 1).toString();
    let args: string = msg.content!.slice(command.length + prefix.length);

    try 
    {
        let commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, msg ,command, args)
    }
    catch(e)
    {
        // * Se não encontrar o módulo, manda mensagem que não existe o comando.
        if (e.code === "MODULE_NOT_FOUND") msg.reply!("Comando não existente.");
        console.log(e)
    }
})



client.login(token);