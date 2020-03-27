import { Client, Message } from "discord.js";

export function run (client: Client, mgs: Message ,cmd: string, args: string)
{
    mgs.reply("Ok");
}

export var Usage = "!teste"
export var Info = "Comando de teste."